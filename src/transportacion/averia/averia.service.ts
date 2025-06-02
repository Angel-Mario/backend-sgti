import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { ChoferService } from './../../personal/chofer/chofer.service'
import { CreateAveriaDto } from './dtos/create-averia.dto'
import { PaginationAveriaDto } from './dtos/pagination-averia.dto'
import { Averia } from './entities/averia.entity'

@Injectable()
export class AveriaService {
  constructor(
    @InjectRepository(Averia)
    private readonly averiaRepository: Repository<Averia>,
    private readonly choferService: ChoferService,
  ) {}
  async loadAveriaPage(userId: string) {
    const chofer = await this.choferService.findOneByUserId(userId)
    chofer.ruta = undefined
    chofer.residencia = undefined
    chofer.user = undefined
    if (!chofer.vehiculo) return { chofer, averias: [] }
    const averias = await this.findAllByVehiculo(chofer.vehiculo.id)
    return { chofer, averias }
  }
  async findAll(paginationDto: PaginationAveriaDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'id',
      search = '',
      column = '',
    } = paginationDto

    let query = this.averiaRepository
      .createQueryBuilder('averia')
      .leftJoinAndSelect('averia.vehiculo', 'vehiculo')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(
        'vehiculo.matricula' === sorting
          ? 'vehiculo.matricula'
          : `averia.${sorting || 'id'}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (search !== '' && column !== '') {
      query = query.where(
        'vehiculo.matricula' === column
          ? 'CAST(vehiculo.matricula AS TEXT) ILIKE(:search)'
          : `CAST(averia.${column} AS TEXT) ILIKE(:search)`,
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
  async findAllByVehiculo(vehiculoId: string) {
    const averias = await this.averiaRepository.find({
      where: { vehiculo: { id: vehiculoId } },
      loadEagerRelations: false,
    })
    return averias
  }
  async findOne(id: string) {
    const averia = await this.averiaRepository.findOneBy({ id })
    if (!averia) throw new NotFoundException('Averia no encontrado')
    return averia
  }

  async create(userdId: string, averiaDto: CreateAveriaDto) {
    const averia = this.averiaRepository.create(averiaDto)
    const vehiculo = (await this.choferService.findOneByUserId(userdId))
      .vehiculo
    if (!vehiculo)
      throw new BadRequestException('Este Chofer no tiene vehículo')
    averia.vehiculo = vehiculo
    return this.averiaRepository.save(averia)
  }
  async removeOne(userId: string, averiaId: string) {
    const averia = await this.findOne(averiaId)
    const chofer = await this.choferService.findOneByUserId(userId)

    if (averia.vehiculo.id !== chofer.vehiculo.id)
      throw new UnauthorizedException(
        'La averia no pertenece al vehículo del chofer',
      )
    await this.averiaRepository.delete({ id: averiaId })
    return 'Averia eliminada correctamente'
  }

  async removeMany(ids: string[], userId: string) {
    const chofer = await this.choferService.findOneByUserId(userId)
    if (chofer) {
      for (const id of ids) {
        this.removeOne(userId, id)
      }
    } else {
      const deleteResult = await this.averiaRepository.delete({ id: In(ids) })
      if (deleteResult.affected === 0) {
        throw new NotFoundException(
          'No se encontraron averias con los ids proporcionados',
        )
      }
      if (deleteResult.affected !== ids.length) {
        throw new NotFoundException(
          'No se pudieron eliminar todos los averias seleccionados',
        )
      }
    }
  }
}
