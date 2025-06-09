import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { User } from 'src/auth/entities/user.entity'
import responseNotFoundMaker from 'src/common/functions/responseNotFoundMaker'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { RutaService } from 'src/geografico/ruta/ruta.service'
import { DataSource, Repository } from 'typeorm'
import { VehiculoService } from '../../transportacion/vehiculo/vehiculo.service'
import { CreateChoferDto } from './dtos/create-chofer.dto'
import { PaginationChoferDto } from './dtos/pagination-chofer.dto'
import { UpdateChoferDto } from './dtos/update-chofer.dto'
import { Chofer } from './entities/chofer.entity'
import { CombustibleChofer } from 'src/gestion/combustible-chofer/entities/combustible-chofer.entity'

@Injectable()
export class ChoferService {
  constructor(
    @InjectRepository(Chofer)
    private readonly choferRepository: Repository<Chofer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly vehiculoService: VehiculoService,
    private readonly rutaService: RutaService,
  ) {}
  async findAll(paginationDto: PaginationChoferDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'nombre_u',
      search = '',
      column = '',
    } = paginationDto

    let query = this.choferRepository
      .createQueryBuilder('chofer')
      .leftJoinAndSelect('chofer.user', 'user')
      .leftJoinAndSelect('chofer.vehiculo', 'vehiculo')
      .leftJoinAndSelect('chofer.ruta', 'ruta')
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .orderBy(
        ['id', 'residencia'].includes(sorting)
          ? `chofer.${sorting || 'id'}`
          : `user.${sorting || 'id'}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (column === 'isActive' && search.toLocaleLowerCase() === 'inactivo') {
      query = query.where(`user.${column} = :search`, {
        search: false,
      })
    } else if (
      column === 'isActive' &&
      search.toLocaleLowerCase() === 'activo'
    ) {
      query = query.where(`user.${column} = :search`, {
        search: true,
      })
    } else if (search !== '' && column !== '') {
      query = query.where(
        ['id', 'residencia'].includes(column)
          ? `CAST(chofer.${column} AS TEXT) ILIKE(:search)`
          : `CAST(user.${column} AS TEXT) ILIKE(:search)`,
        {
          search: `%${search}%`,
        },
      )
    }

    const data = await query.getManyAndCount()

    return {
      data: data[0].map((chofer) => {
        const { id, residencia, user, vehiculo, ruta } = chofer
        const { id: _id, roles: _roles, ...rest } = user
        return {
          id: id,
          vehiculo,
          ruta,
          residencia,
          ...rest,
        }
      }),
      count: data[1],
      pages: Math.ceil(data[1] / pageSize),
    }
  }
  async me(id: string) {
    const chofer = await this.findOneByUserId(id)
    return { ...chofer, user: undefined }
  }
  async findUsersWithoutCombustible() {
    const chofers = await this.choferRepository
      .createQueryBuilder('chofer')
      .leftJoinAndSelect('chofer.user', 'user')
      .leftJoinAndSelect(
        CombustibleChofer,
        'combustible',
        'combustible.chofer = chofer.id',
      )
      .where('combustible.id IS NULL')
      .getMany()
    return chofers.map((chofer) => chofer.user.nombre_u)
  }

  async findOne(id: string) {
    const chofer = await this.choferRepository.findOneBy({ id })
    if (!chofer) throw new NotFoundException('Chofer no encontrado')
    return chofer
  }
  async findOneByUserId(userId: string) {
    const chofer = await this.choferRepository.findOneBy({
      user: { id: userId },
    })
    if (!chofer) throw new NotFoundException('Chofer no encontrado')
    return chofer
  }
  async findOneByUserName(nombre_u: string) {
    const chofer = await this.choferRepository.findOneBy({
      user: { nombre_u },
    })
    if (!chofer) throw new NotFoundException('Chofer no encontrado')
    return chofer
  }

  async create(createChoferDto: CreateChoferDto) {
    try {
      const {
        password,
        vehiculoMatricula,
        rutaNombre,
        residencia,
        ...userData
      } = createChoferDto

      const user = {
        ...userData,
        password: await bcrypt.hash(password, 10),
        isActive: true,
        roles: ['chofer'],
      }

      const chofer = new Chofer()
      if (vehiculoMatricula) {
        const vehiculo = await this.vehiculoService.findOne(vehiculoMatricula)
        if (vehiculo) chofer.vehiculo = vehiculo
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
    const { vehiculoMatricula, residencia, rutaNombre, ...userData } =
      updateChoferDto

    const chofer = await this.findOne(id)
    const user = await this.userRepository.findOneBy({ id: chofer.user.id })

    if (vehiculoMatricula) {
      if (!chofer.vehiculo || chofer.vehiculo.matricula !== vehiculoMatricula)
        chofer.vehiculo = await this.vehiculoService.findOne(vehiculoMatricula)
    } else {
      chofer.vehiculo = null
    }
    if (rutaNombre) {
      if (!chofer.ruta || chofer.ruta.nombre !== rutaNombre)
        chofer.ruta = await this.rutaService.findOne(rutaNombre)
    } else {
      chofer.ruta = null
    }
    try {
      if (userData.password) {
        userData.password = bcrypt.hashSync(userData.password, 10)
      }
      Object.assign(user, userData)
      chofer.user = user
      chofer.residencia = residencia
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
        const {
          password,
          vehiculoMatricula,
          rutaNombre,
          residencia,
          ...userData
        } = createChoferDto

        const user = {
          ...userData,
          password: await bcrypt.hash(password, 10),
          isActive: true,
          roles: ['chofer'],
        }

        const chofer = new Chofer()
        if (vehiculoMatricula) {
          const vehiculo = await this.vehiculoService.findOne(vehiculoMatricula)
          if (vehiculo) chofer.vehiculo = vehiculo
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
          ).user.id,
        )
      } catch (error) {
        handleDBErrors(error)
      }
    }
    return ids
  }
}
