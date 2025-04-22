import { PuntoRefService } from 'src/geografico/punto-ref/punto-ref.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Ruta } from './entities/ruta.entity'
import { PaginationRutaDto } from './dtos/pagination-ruta.dto'
import { UpdateRutaDto } from './dtos/update-ruta.dto'
import { CreateRutaDto } from './dtos/create-ruta.dto'
import { isUUID } from 'class-validator'
import handleDBErrors from 'src/common/handlers/handleDBErrors'

@Injectable()
export class RutaService {
  constructor(
    @InjectRepository(Ruta) private readonly rutaRepository: Repository<Ruta>,
    private readonly puntoRefService: PuntoRefService,
  ) {}

  async findSimplex() {
    const nombres = await this.rutaRepository.find({
      select: {
        nombre: true,
        distancia: false,
        id: false,
        hora_regreso: false,
        hora_salida: false,
        puntoRegreso: false,
        puntoSalida: false,
      },
    })
    return nombres.map((obj) => obj.nombre)
  }
  async findAll(paginationDto: PaginationRutaDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'nombre',
      search = '',
      column = '',
    } = paginationDto

    const query = this.rutaRepository
      .createQueryBuilder('ruta')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(
        `ruta.${sorting}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (search !== '' && column !== '') {
      query.where(`CAST(ruta.${column} AS TEXT) LIKE(:search)`, {
        search: `%${search}%`,
      })
    }
    //unir columna puntoSalida con la tabla punto-ref by id
    query
      .innerJoinAndSelect('ruta.puntoSalida', 'rutaSalida')
      .innerJoinAndSelect('ruta.puntoRegreso', 'rutaSalidaRegreso')
    // query.leftJoinAndSelect('ruta.puntoSalida', 'puntoSalida')
    const data = await query.getManyAndCount()

    return {
      data: data[0],
      count: data[1],
      pages: Math.ceil(data[1] / pageSize),
    }
  }
  async update(id: string, updateRutaDto: UpdateRutaDto) {
    const rutaDb = await this.findOne(id)
    const ruta = rutaDb

    try {
      Object.assign(ruta, updateRutaDto)
      if (
        updateRutaDto.puntoRegreso &&
        ruta.puntoRegreso.nombre !== updateRutaDto.puntoRegreso
      ) {
        const puntoRegreso = await this.puntoRefService.findOneByName(
          updateRutaDto.puntoRegreso,
        )
        ruta.puntoRegreso = puntoRegreso
      } else {
        ruta.puntoRegreso = rutaDb.puntoRegreso
      }
      if (
        updateRutaDto.puntoSalida &&
        ruta.puntoSalida.nombre !== updateRutaDto.puntoSalida
      ) {
        const puntoSalida = await this.puntoRefService.findOneByName(
          updateRutaDto.puntoSalida,
        )
        ruta.puntoSalida = puntoSalida
      } else {
        ruta.puntoSalida = rutaDb.puntoSalida
      }
      return await this.rutaRepository.save(ruta)
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async findOne(id: string) {
    let ruta: undefined | Ruta = undefined
    if (isUUID(id, '4')) {
      ruta = await this.rutaRepository.findOneBy({ id })
    } else {
      ruta = await this.rutaRepository.findOneBy({ nombre: id })
    }
    if (!ruta) throw new NotFoundException('Ruta no encontrada')
    return ruta
  }
  async create(createRutaDto: CreateRutaDto) {
    try {
      const puntoRegreso = await this.puntoRefService.findOneByName(
        createRutaDto.puntoRegreso,
      )
      const puntoSalida = await this.puntoRefService.findOneByName(
        createRutaDto.puntoSalida,
      )
      const ruta = this.rutaRepository.create({
        ...createRutaDto,
        puntoRegreso,
        puntoSalida,
      })
      await this.rutaRepository.save(ruta)
    } catch (error) {
      handleDBErrors(error)
    }
    return 'Ruta creada correctamente'
  }
  async removeMany(ids: string[]) {
    const deleteResult = await this.rutaRepository.delete({ id: In(ids) })
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        'No se encontraron rutas con los ids proporcionados',
      )
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se pudieron eliminar todas las rutas seleccionadas',
      )
    }
  }
}
