import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/entities/user.entity'
import { In, Repository } from 'typeorm'
import { AdministradorService } from './../administrador/administrador.service'
import { PaginationUsuarioDto } from './dtos/pagination-usuario.dto'

import * as bcrypt from 'bcrypt'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { ChoferService } from '../chofer/chofer.service'
import { SuministradorService } from '../suministrador/suministrador.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly adminService: AdministradorService,
    private readonly suministradorService: SuministradorService,
    private readonly choferService: ChoferService,
  ) {}
  async findAll(paginationDto: PaginationUsuarioDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'nombre_u',
      search = '',
      column = '',
    } = paginationDto

    const query = this.userRepository
      .createQueryBuilder('user')
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .orderBy(
        `user.${sorting}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )

    if (column === 'isActive' && search.toLocaleLowerCase() === 'inactivo') {
      query.where(`user.${column} = :search`, { search: false })
    } else if (
      column === 'isActive' &&
      search.toLocaleLowerCase() === 'activo'
    ) {
      query.where(`user.${column} = :search`, { search: true })
    } else if (search !== '' && column !== '') {
      query.where(`CAST(user.${column} AS TEXT) ILIKE(:search)`, {
        search: `%${search}%`,
      })
    }
    const data = await query.getManyAndCount()

    return {
      data: data[0],
      count: data[1],
      pages: Math.ceil(data[1] / pageSize),
    }
  }
  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new NotFoundException('Usuario no encontrado')
    return user
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)

    try {
      if (updateUserDto.roles && updateUserDto.roles[0] !== user.roles[0]) {
        if (user.roles.includes('admin')) {
          this.adminService.softDelete(id)
        } else if (user.roles.includes('chofer'))
          this.choferService.softDelete(id)
        else if (user.roles.includes('suministrador'))
          this.suministradorService.softDelete(id)
      }
      if (updateUserDto.password) {
        updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10)
      }
      Object.assign(user, updateUserDto)

      return await this.userRepository.save(user)
    } catch (error) {
      handleDBErrors(error)
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      })

      await this.userRepository.save(user)

      if (createUserDto.roles) {
        if (user.roles.includes('admin')) {
          this.adminService.softCreate(user.id)
        } else if (user.roles.includes('chofer'))
          this.choferService.softCreate(user.id)
        else if (user.roles.includes('suministrador'))
          this.suministradorService.softCreate(user.id)
      }

      return 'Usuario creado correctamente'
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async removeMany(ids: string[]) {
    const deleteResult = await this.userRepository.delete({ id: In(ids) })
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        'No se encontraron usuarios con los ids proporcionados',
      )
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se pudieron eliminar todos los usuarios seleccionados',
      )
    }
    return 'Usuarios eliminados correctamente'
  }
  // Remove One Deprecated
  // async remove(id: string) {
  //   const deleteResult = await this.userRepository.delete({ id });
  //   if (deleteResult.affected !== 1)
  //     throw new NotFoundException('Usuario no encontrado');
  // }
}
