import { Injectable, NotFoundException } from '@nestjs/common'
import { PaginationPuntoRefDto } from './dto/pagination-usuario.dto'
import { CreatePuntoRefDto } from './dto/create-punto-ref.dto'
import { UpdatePuntoRefDto } from './dto/update-punto-ref.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { PuntoRef } from './entities/punto-ref.entity'
import { In, Repository } from 'typeorm'
import handleDBErrors from 'src/common/handlers/handleDBErrors'

@Injectable()
export class PuntoRefService {
  constructor(
    @InjectRepository(PuntoRef)
    private readonly puntoRefRepository: Repository<PuntoRef>,
  ) {}

  async findAll(paginationDto: PaginationPuntoRefDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'nombre',
      search = '',
      column = '',
    } = paginationDto

    const query = this.puntoRefRepository
      .createQueryBuilder('puntoRef')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(
        `puntoRef.${sorting}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (search !== '') {
      if (column === 'id') {
        query.where('cast(puntoRef.id as varchar) LIKE(:search)', {
          search: `%${search}%`,
        })
      } else if (column !== '') {
        query.where(`puntoRef.${column} ILIKE(:search)`, {
          search: `%${search}%`,
        })
      }
    }

    const data = await query.getManyAndCount()

    return {
      data: data[0],
      count: data[1],
      pages: Math.ceil(data[1] / pageSize),
    }
  }
  async findSimplex() {
    const nombres = await this.puntoRefRepository.find({
      select: {
        nombre: true,
        latLong: false,
        id: true,
      },
    })
    return nombres
  }

  async update(id: number, updatePuntoRefDto: UpdatePuntoRefDto) {
    const puntoRef = await this.findOne(id)

    try {
      Object.assign(puntoRef, updatePuntoRefDto)
      return await this.puntoRefRepository.save(puntoRef)
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async create(createPuntoRefDto: CreatePuntoRefDto) {
    try {
      const puntoRef = this.puntoRefRepository.create(createPuntoRefDto)
      await this.puntoRefRepository.save(puntoRef)
    } catch (error) {
      handleDBErrors(error)
    }
    return 'Punto de Referencia creado correctamente'
  }
  async findOne(id: number) {
    const puntoRef = await this.puntoRefRepository.findOneBy({ id })
    if (!puntoRef)
      throw new NotFoundException('Punto de Referencia no encontrado')
    return puntoRef
  }
  async findOneByName(nombre: string) {
    const puntoRef = await this.puntoRefRepository.findOneBy({ nombre })
    if (!puntoRef)
      throw new NotFoundException('Punto de Referencia no encontrado')
    return puntoRef
  }

  async removeMany(ids: number[]) {
    const deleteResult = await this.puntoRefRepository.delete({ id: In(ids) })
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        'No se encontraron puntos de referencia con los ids proporcionados',
      )
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se pudieron eliminar todos los puntos de referencia seleccionados',
      )
    }
  }
}
