import { OmnibusService } from './../../transportacion/omnibus/omnibus.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/entities/user.entity'
import { DataSource, Repository } from 'typeorm'
import { Chofer } from './entities/chofer.entity'
import { PaginationChoferDto } from './dtos/pagination-chofer.dto'
import { CreateChoferDto } from './dtos/create-chofer.dto'
import { UpdateChoferDto } from './dtos/update-chofer.dto'
import * as bcrypt from 'bcrypt'
import responseNotFoundMaker from 'src/common/functions/responseNotFoundMaker'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { RutaService } from 'src/geografico/ruta/ruta.service'

@Injectable()
export class ChoferService {
  constructor(
    @InjectRepository(Chofer)
    private readonly choferRepository: Repository<Chofer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly omnibusService: OmnibusService,
    private readonly rutaService: RutaService,
  ) {}
  async findAll(paginationDto: PaginationChoferDto) {
    return await this.choferRepository.find()
  }

  async findOne(id: string) {
    const chofer = await this.choferRepository.findOneBy({ id })
    if (!chofer) throw new NotFoundException('Chofer no encontrado')
    return chofer
  }

  async create(createChoferDto: CreateChoferDto) {
    try {
      const { password, omnibusChapa, rutaNombre, residencia, ...userData } =
        createChoferDto

      const user = {
        ...userData,
        password: await bcrypt.hash(password, 10),
        isActive: true,
        roles: ['chofer'],
      }

      const chofer = new Chofer()
      if (omnibusChapa) {
        const omnibus = await this.omnibusService.findOne(omnibusChapa)
        if (omnibus) chofer.omnibus = omnibus
      }
      if (residencia) {
        chofer.residencia = residencia
      }
      if (rutaNombre) {
        const ruta = await this.rutaService.findOne(rutaNombre)
        if (ruta) chofer.ruta = ruta
      }
      chofer.user = this.userRepository.create(user)

      await this.choferRepository.save(this.choferRepository.create(chofer))
      return 'Chofer creado correctamente'
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async update(id: string, updateChoferDto: UpdateChoferDto) {
    const { omnibusChapa, residencia, rutaNombre, ...userData } =
      updateChoferDto

    const chofer = await this.findOne(id)
    const user = await this.userRepository.findOneBy({ id: chofer.user.id })

    if (omnibusChapa) {
      if (!chofer.omnibus || chofer.omnibus.chapa !== omnibusChapa)
        chofer.omnibus = await this.omnibusService.findOne(omnibusChapa)
    }
    if (rutaNombre) {
      if (!chofer.ruta || chofer.ruta.nombre !== rutaNombre)
        chofer.ruta = await this.rutaService.findOne(rutaNombre)
    }
    try {
      Object.assign(user, userData)
      chofer.user = user
      Object.assign(chofer, residencia)

      return await this.choferRepository.save(chofer)
    } catch (error) {
      handleDBErrors(error)
    }
  }

  async removeMany(ids: string[]) {
    // Find all choferes with their users
    const choferes = await this.choferRepository.find({
      where: ids.map((id) => ({ id })),
      relations: ['user'],
    })
    if (!choferes.length)
      responseNotFoundMaker(ids.length, 'chofer', 'es', 'id')

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      // Delete all choferes by ids
      await transactionalEntityManager.delete(Chofer, ids)

      // Get all associated user IDs
      const userIds = choferes
        .map((chofer) => chofer.user?.id)
        .filter((id) => id !== undefined)

      // Delete all associated users
      if (userIds.length) {
        const deleteResult = await transactionalEntityManager.delete(
          User,
          userIds,
        )
        if (deleteResult.affected === 0) {
          responseNotFoundMaker(userIds.length, 'chofer', 'es', 'id')
        }
        if (deleteResult.affected !== ids.length) {
          responseNotFoundMaker(userIds.length, 'chofer', '', 'id')
        }
      }
    })
  }

  async softDelete(id: string) {
    await this.choferRepository.delete({ user: { id } })
  }
  async softCreate(id: string) {
    const chofer = this.choferRepository.create({ user: { id } })
    await this.choferRepository.save(chofer)
  }
  //Seed Propuse Method
  async createMany(createChoferDtos: CreateChoferDto[]) {
    const ids: string[] = []

    for (const createChoferDto of createChoferDtos) {
      try {
        const { password, omnibusChapa, rutaNombre, residencia, ...userData } =
          createChoferDto

        const user = {
          ...userData,
          password: await bcrypt.hash(password, 10),
          isActive: true,
          roles: ['chofer'],
        }

        const chofer = new Chofer()
        if (omnibusChapa) {
          const omnibus = await this.omnibusService.findOne(omnibusChapa)
          if (omnibus) chofer.omnibus = omnibus
        }
        if (residencia) {
          chofer.residencia = residencia
        }
        if (rutaNombre) {
          const ruta = await this.rutaService.findOne(rutaNombre)
          if (ruta) chofer.ruta = ruta
        }
        chofer.user = this.userRepository.create(user)

        ids.push(
          (
            await this.choferRepository.save(
              this.choferRepository.create(chofer),
            )
          ).id,
        )
      } catch (error) {
        handleDBErrors(error)
      }
    }
    return ids
  }
}
