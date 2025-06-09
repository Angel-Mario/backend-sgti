import { CreatePuntoCombustibleDto } from './dto/create-punto-comb.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { PuntoCombustible } from './entities/punto-comb.entity'
import { Injectable, NotFoundException } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { PaginationPuntoCombustibleDto } from './dto/pagination-punto-comb.dto'
import { PuntoRefService } from '../punto-ref/punto-ref.service'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { UpdatePuntoCombustibleDto } from './dto/update-punto-comb.dto'

@Injectable()
export class PuntoCombustibleService {
  constructor(
    @InjectRepository(PuntoCombustible)
    private readonly puntoCombustibleRepository: Repository<PuntoCombustible>,
    private readonly puntoRefService: PuntoRefService,
  ) {}

  async findSimplex() {
    const nombres = await this.puntoCombustibleRepository.find({
      select: {
        nombre: true,
        puntoRef: false,
        id: false,
      },
    })
    return nombres.map((puntosComb) => puntosComb.nombre)
  }
  async findOneByName(nombre: string) {
    const puntoComb = await this.puntoCombustibleRepository.findOneBy({
      nombre,
    })
    if (!puntoComb)
      throw new NotFoundException('Punto de Combustible no encontrado')
    return puntoComb
  }

  async findAll(paginationDto: PaginationPuntoCombustibleDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'nombre',
      search = '',
      column = '',
    } = paginationDto

    let query = this.puntoCombustibleRepository
      .createQueryBuilder('puntoComb')
      .leftJoinAndSelect('puntoComb.puntoRef', 'puntoRef')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(
        sorting === 'puntoRef'
          ? 'puntoRef.nombre'
          : `puntoComb.${sorting || 'id'}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )

    if (search !== '' && column !== '') {
      query = query.where(
        column === 'puntoRef'
          ? 'CAST(puntoRef.nombre AS TEXT) ILIKE(:search)'
          : `CAST(puntoComb.${column} AS TEXT) ILIKE(:search)`,
        {
          search: `%${search}%`,
        },
      )
    }

    const data = await query.getManyAndCount()

    return {
      data: data[0],
      count: data[1],
      pages: Math.ceil(data[1] / pageSize),
    }
  }
  async findOne(id: number) {
    const puntoComb = await this.puntoCombustibleRepository.findOneBy({ id })
    if (!puntoComb)
      throw new NotFoundException('Punto de Combustible no encontrado')
    return puntoComb
  }

  async create(createPuntoCombustibleDto: CreatePuntoCombustibleDto) {
    try {
      const puntoRef = await this.puntoRefService.findOneByName(
        createPuntoCombustibleDto.puntoRef,
      )
      const terminal = this.puntoCombustibleRepository.create({
        nombre: createPuntoCombustibleDto.nombre,
        puntoRef: puntoRef,
      })
      await this.puntoCombustibleRepository.save(terminal)
    } catch (error) {
      handleDBErrors(error)
    }
    return 'Punto de combustible creado correctamente'
  }
  async update(
    id: number,
    updatePuntoCombustibleDto: UpdatePuntoCombustibleDto,
  ) {
    const puntoComb = await this.findOne(id)
    const puntoRef = await this.puntoRefService.findOneByName(
      updatePuntoCombustibleDto.puntoRef,
    )
    puntoComb.nombre = updatePuntoCombustibleDto.nombre
    puntoComb.puntoRef = puntoRef
    try {
      return await this.puntoCombustibleRepository.save(puntoComb)
    } catch (error) {
      handleDBErrors(error)
    }
  }

  async removeMany(ids: number[]) {
    const deleteResult = await this.puntoCombustibleRepository.delete({
      id: In(ids),
    })
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        'No se encontraron puntos de combustible con los ids proporcionados',
      )
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se pudieron eliminar todas los puntos de combustible seleccionados',
      )
    }
  }
}
