import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { ChoferService } from 'src/personal/chofer/chofer.service'
import { In, Repository } from 'typeorm'
import { CreateSolicitudApoyoDto } from './dtos/create-solicitud-apoyo.dto'
import { PaginationSolicitudApoyoDto } from './dtos/pagination-solicitud-apoyo.dto'
import { SolicitudApoyo } from './entities/solicitud-apoyo.entity'

@Injectable()
export class SolicitudApoyoService {
  constructor(
    @InjectRepository(SolicitudApoyo)
    private readonly solicitudApoyoRepository: Repository<SolicitudApoyo>,
    private readonly choferService: ChoferService,
  ) {}
  async loadSolicitudApoyoPage(userId: string) {
    const chofer = await this.choferService.findOneByUserId(userId)
    const solicitudes = await this.solicitudApoyoRepository.findBy({
      chofer: { id: chofer.id },
    })

    return solicitudes.map((solicitud) => ({
      descripcion: solicitud.descripcion,
      fecha: solicitud.fecha,
      latLong: solicitud.latLong,
      id: solicitud.id,
    }))
  }
  async findOne(id: string) {
    const solicitudApoyo = await this.solicitudApoyoRepository.findOneBy({
      id,
    })
    if (!solicitudApoyo)
      throw new NotFoundException('Solicitud de apoyo no encontrada')
    return solicitudApoyo
  }

  async findAll(paginationDto: PaginationSolicitudApoyoDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'id',
      search = '',
      column = '',
    } = paginationDto

    const query = this.solicitudApoyoRepository
      .createQueryBuilder('solicitudApoyo')
      .leftJoinAndSelect('solicitudApoyo.chofer', 'chofer')
      .leftJoinAndSelect('chofer.user', 'user')
      .select([
        'solicitudApoyo.id',
        'solicitudApoyo.fecha',
        'solicitudApoyo.descripcion',
        'solicitudApoyo.latLong',
        'user.fullName',
        'user.telefono',
        'chofer.id',
      ])
      .skip((page - 1) * pageSize)
      .take(pageSize)
    //   .orderBy(
    //     ['id', 'vehiculo'].includes(sorting)
    //       ? `solicitudApoyo.${sorting || 'id'}`
    //       : `vehiculo.${sorting || 'id'}`,
    //     `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
    //   )
    // if (search !== '' && column !== '') {
    //   query.where(
    //     ['id', 'vehiculo'].includes(column)
    //       ? `CAST(solicitudApoyo.${column} AS TEXT) ILIKE(:search)`
    //       : `CAST(vehiculo.${column} AS TEXT) ILIKE(:search)`,
    //     {
    //       search: `%${search}%`,
    //     },
    //   )
    // }
    const data = await query.getManyAndCount()
    return {
      data: data[0],
      count: data[1],
      pages: Math.ceil(data[1] / pageSize),
    }
  }
  async create(userId: string, solicitudApoyoDto: CreateSolicitudApoyoDto) {
    const chofer = await this.choferService.findOneByUserId(userId)
    try {
      const solicitudApoyo =
        this.solicitudApoyoRepository.create(solicitudApoyoDto)
      solicitudApoyo.chofer = chofer
      solicitudApoyo.fecha = new Date()

      await this.solicitudApoyoRepository.save(solicitudApoyo)
    } catch (error) {
      console.log('handle')
      handleDBErrors(error)
      console.log('handled')
    }
    return 'Solicitud de apoyo creada correctamente'
  }

  async removeOne(userId: string, solicitudApoyoId: string) {
    const solicitudApoyo = await this.findOne(solicitudApoyoId)
    const chofer = await this.choferService.findOneByUserId(userId)

    if (solicitudApoyo.chofer.id !== chofer.id) {
      throw new UnauthorizedException(
        'La solicitud de apoyo no pertenece al chofer',
      )
    }
    await this.solicitudApoyoRepository.remove(solicitudApoyo)
    return 'Solicitud de apoyo eliminada correctamente'
  }

  async removeMany(ids: string[], userId: string) {
    const chofer = await this.choferService.findOneByUserId(userId)
    if (chofer) {
      for (const id of ids) {
        this.removeOne(userId, id)
      }
    } else {
      const deleteResult = await this.solicitudApoyoRepository.delete({
        id: In(ids),
      })
      if (deleteResult.affected === 0) {
        throw new NotFoundException(
          'No se encontraron solicitudes de apoyo con los ids proporcionados',
        )
      }
      if (deleteResult.affected !== ids.length) {
        throw new NotFoundException(
          'No se pudieron eliminar todos las solicitudes de apoyo seleccionadas',
        )
      }
    }
  }
}
