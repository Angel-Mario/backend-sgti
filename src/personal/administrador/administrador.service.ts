import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { PaginationAdministradorDto } from './dtos/pagination-admin.dto'
import { Admin } from './entities/administrador.entity'

import * as bcrypt from 'bcrypt'
import { User } from 'src/auth/entities/user.entity'
import responseNotFoundMaker from 'src/common/functions/responseNotFoundMaker'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { CreateAdminDto } from './dtos/create-admin.dto'
import { UpdateAdminDto } from './dtos/update-admin.dto'

@Injectable()
export class AdministradorService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findOne(id: string) {
    const admin = await this.adminRepository.findOneBy({ id })
    if (!admin) throw new NotFoundException('Administrador no encontrado')
    return admin
  }

  async findAll(paginationDto: PaginationAdministradorDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'nombre_u',
      search = '',
      column = '',
    } = paginationDto

    let query = this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.user', 'user')
      .skip(pageSize * (page - 1))
      .take(pageSize)
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
      query = query.where(
        column === 'id'
          ? 'CAST(admin.id AS TEXT) ILIKE(:search)'
          : `CAST(user.${column} AS TEXT) ILIKE(:search)`,
        {
          search: `%${search}%`,
        },
      )
    }

    const data = await query.getManyAndCount()

    return {
      data: data[0].map((admin) => {
        const { id: _id, roles: _roles, ...rest } = admin.user
        return {
          id: admin.id,
          ...rest,
        }
      }),
      count: data[1],
      pages: Math.ceil(data[1] / pageSize),
    }
  }
  async create(createAdminDto: CreateAdminDto) {
    try {
      const { password, ...userData } = createAdminDto
      const user = {
        ...userData,
        password: await bcrypt.hash(password, 10),
        isActive: true,
        roles: ['admin'],
      }

      const admin = new Admin()
      admin.user = this.userRepository.create(user)

      await this.adminRepository.save(this.adminRepository.create(admin))

      return 'Administrador creado correctamente'
    } catch (error) {
      handleDBErrors(error)
    }
  }

  async update(id: string, updateUserDto: UpdateAdminDto) {
    const userId = (await this.findOne(id)).user.id
    const user = await this.userRepository.findOneBy({ id: userId })

    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10)
    }
    Object.assign(user, updateUserDto)
    try {
      return await this.userRepository.save(user)
    } catch (error) {
      handleDBErrors(error)
    }
  }

  async removeMany(ids: string[]) {
    // Find all admins with their users
    const admins = await this.adminRepository.find({
      where: ids.map((id) => ({ id })),
      relations: ['user'],
    })
    if (!admins.length)
      responseNotFoundMaker(ids.length, 'administrador', 'es', 'id')

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      // Delete all admins by ids
      await transactionalEntityManager.delete(Admin, ids)

      // Get all associated user IDs
      const userIds = admins
        .map((admin) => admin.user?.id)
        .filter((id) => id !== undefined)

      // Delete all associated users
      if (userIds.length) {
        const deleteResult = await transactionalEntityManager.delete(
          User,
          userIds,
        )
        if (deleteResult.affected === 0) {
          responseNotFoundMaker(userIds.length, 'administrador', 'es', 'id')
        } else if (deleteResult.affected !== ids.length) {
          responseNotFoundMaker(userIds.length, 'administrador', '', 'id')
        }
      }
    })
  }

  async softDelete(id: string) {
    await this.adminRepository.delete({ user: { id } })
  }
  async softCreate(id: string) {
    const admin = this.adminRepository.create({ user: { id } })
    await this.adminRepository.save(admin)
  }
  //Seed Propuse Method
  async createMany(createAdminDtos: CreateAdminDto[]) {
    const ids: string[] = []
    for (const createAdminDto of createAdminDtos) {
      try {
        const { password, ...userData } = createAdminDto
        const user = {
          ...userData,
          password: await bcrypt.hash(password, 10),
          isActive: true,
          roles: ['admin'],
        }

        const admin = new Admin()
        admin.user = this.userRepository.create(user)

        ids.push(
          (await this.adminRepository.save(this.adminRepository.create(admin)))
            .id,
        )
      } catch (error) {
        handleDBErrors(error)
      }
    }
    return ids
  }
}
