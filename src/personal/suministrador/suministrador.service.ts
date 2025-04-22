import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/entities/user.entity'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { DataSource, Repository } from 'typeorm'
import { CreateSuministradorDto } from './dtos/create-suministrador.dto'
import { PaginationSuministradorDto } from './dtos/pagination-suministrador.dto'
import { UpdateSuministradorDto } from './dtos/update-suministrador.dto'
import { Suministrador } from './entities/suministrador.entity'

import * as bcrypt from 'bcrypt'
import responseNotFoundMaker from 'src/common/functions/responseNotFoundMaker'

@Injectable()
export class SuministradorService {
  constructor(
    @InjectRepository(Suministrador)
    private readonly suministradorRepository: Repository<Suministrador>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findOne(id: string) {
    const suministrador = await this.suministradorRepository.findOneBy({ id })
    if (!suministrador)
      throw new NotFoundException('Suministrador no encontrado')
    return suministrador
  }

  async findAll(paginationDto: PaginationSuministradorDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'nombre_u',
      search = '',
      column = '',
    } = paginationDto

    let query = this.suministradorRepository
      .createQueryBuilder('sumin')

      .leftJoinAndSelect('sumin.user', 'user')
      .skip(pageSize * (page - 1))
      .take(pageSize || pageSize)
      .orderBy(
        `user.${sorting || 'id'}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (column === 'isActive' && search.toLocaleLowerCase() === 'inactivo') {
      query = query.where(`user.${column} = :search`, { search: false })
    } else if (
      column === 'isActive' &&
      search.toLocaleLowerCase() === 'activo'
    ) {
      query = query.where(`user.${column} = :search`, { search: true })
    } else if (search !== '' && column !== '') {
      query = query.where(`CAST(user.${column} AS TEXT) ILIKE(:search)`, {
        search: `%${search}%`,
      })
    }

    const data = await query.getManyAndCount()

    return {
      data: data[0].map((sumin) => {
        const { user, ...suministrador } = sumin
        const { id: _id, roles: _roles, ...rest } = user
        return {
          ...suministrador,
          ...rest,
        }
      }),
      count: data[1],
      pages: Math.ceil(data[1] / pageSize),
    }
  }
  async create(createSuministradorDto: CreateSuministradorDto) {
    try {
      const { password, cargo, ...userData } = createSuministradorDto
      const user = {
        ...userData,
        password: await bcrypt.hash(password, 10),
        isActive: true,
        roles: ['suministrador'],
      }

      const suministrador = new Suministrador()
      suministrador.cargo = cargo
      suministrador.user = this.userRepository.create(user)

      await this.suministradorRepository.save(
        this.suministradorRepository.create(suministrador),
      )
      return 'Suministrador creado correctamente'
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async update(id: string, updateSuministradorDto: UpdateSuministradorDto) {
    const { cargo, ...userData } = updateSuministradorDto
    const sumin = await this.findOne(id)
    const user = await this.userRepository.findOneBy({ id: sumin.user.id })
    sumin.user = user
    if (cargo) sumin.cargo = cargo
    try {
      Object.assign(user, userData)
      return await this.suministradorRepository.save(sumin)
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async removeMany(ids: string[]) {
    // Find all suministradores with their users
    const suministradores = await this.suministradorRepository.find({
      where: ids.map((id) => ({ id })),
      relations: ['user'],
    })
    if (!suministradores.length)
      responseNotFoundMaker(ids.length, 'suministrador', 'es', 'id')

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      // Delete all suministradores by ids
      await transactionalEntityManager.delete(Suministrador, ids)

      // Get all associated user IDs
      const userIds = suministradores
        .map((sumin) => sumin.user?.id)
        .filter((id) => id !== undefined)

      // Delete all associated users
      if (userIds.length) {
        const deleteResult = await transactionalEntityManager.delete(
          User,
          userIds,
        )
        if (deleteResult.affected === 0) {
          responseNotFoundMaker(userIds.length, 'suministrador', 'es', 'id')
        }
        if (deleteResult.affected !== ids.length) {
          responseNotFoundMaker(userIds.length, 'suministrador', '', 'id')
        }
      }
    })
  }

  async softDelete(id: string) {
    await this.suministradorRepository.delete({ user: { id } })
  }
  async softCreate(id: string) {
    const suministrador = this.suministradorRepository.create({ user: { id } })
    await this.suministradorRepository.save(suministrador)
  }
}
