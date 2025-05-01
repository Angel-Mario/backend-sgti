import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isUUID } from 'class-validator'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { Chofer } from 'src/personal/chofer/entities/chofer.entity'
import { In, Repository } from 'typeorm'
import { CreateVehiculoDto } from './dtos/create-vehiculo.dto'
import { PaginationVehiculoDto } from './dtos/pagination-vehiculo.dto'
import { UpdateVehiculoDto } from './dtos/update-vehiculo.dto'
import { Vehiculo } from './entities/vehiculo.entity'

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  async findAll(paginationDto: PaginationVehiculoDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'matricula',
      search = '',
      column = '',
    } = paginationDto

    const query = this.vehiculoRepository
      .createQueryBuilder('vehiculo')
      .leftJoinAndMapOne(
        'vehiculo.chofer', // Nueva propiedad en el objeto vehiculo
        Chofer, // La entidad que queremos unir (Chofer)
        'chofer', // Alias para la entidad Chofer en la consulta
        'chofer.vehiculoId = vehiculo.id', // Condición de join
      )
      .select(['vehiculo', 'chofer.id'])
      .skip((page - 1) * pageSize)
      .take(pageSize)

      .orderBy(
        sorting === 'chofer' ? 'chofer.id' : `vehiculo.${sorting}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (search !== '' && column !== '') {
      query.where(`CAST(vehiculo.${column} AS TEXT) LIKE(:search)`, {
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

  async findAllSimplex() {
    const vehiculoes = await this.vehiculoRepository.find({
      select: {
        id: false,
        matricula: true,
        marca: false,
        modelo: false,
        capacidad: false,
        año: false,
        consumo: false,
      },
    })
    return vehiculoes.map((obj) => obj.matricula)
  }

  async update(id: string, updatevehiculoDto: UpdateVehiculoDto) {
    const vehiculo = await this.vehiculoRepository.findOneBy({ id })

    try {
      Object.assign(vehiculo, updatevehiculoDto)
      return await this.vehiculoRepository.save(vehiculo)
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async create(createvehiculoDto: CreateVehiculoDto) {
    try {
      const vehiculo = this.vehiculoRepository.create(createvehiculoDto)
      await this.vehiculoRepository.save(vehiculo)
    } catch (error) {
      handleDBErrors(error)
    }
    return 'Vehículo creado correctamente'
  }
  async findOne(id: string) {
    let vehiculo: undefined | Vehiculo = undefined
    if (isUUID(id, '4')) {
      vehiculo = await this.vehiculoRepository.findOneBy({ id })
    } else {
      vehiculo = await this.vehiculoRepository.findOneBy({ matricula: id })
    }
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado')
    return vehiculo
  }
  async removeMany(ids: string[]) {
    const deleteResult = await this.vehiculoRepository.delete({ id: In(ids) })
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        'No se encontraron vehículos con los ids proporcionados',
      )
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se pudieron eliminar todos los vehículos seleccionados',
      )
    }
  }
}
