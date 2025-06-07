import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { ChoferService } from 'src/personal/chofer/chofer.service'
import { In, Repository } from 'typeorm'
import { CreateSolicitudPiezaDto } from './dtos/create-solicitud-pieza.dto'
import { PaginationSolicitudPiezaDto } from './dtos/pagination-solicitud-pieza.dto'
import { UpdateSolicitudPiezaDto } from './dtos/update-solictud-pieza.dto'
import { SolicitudPieza } from './entities/solicitud-pieza.entity'

@Injectable()
export class SolicitudPiezaService {
  constructor(
    @InjectRepository(SolicitudPieza)
    private readonly solicitudPiezaRepository: Repository<SolicitudPieza>,
    private readonly choferService: ChoferService,
  ) {}
  async loadSolicitudPiezaPage(userId: string) {
    const chofer = await this.choferService.findOneByUserId(userId)

    const solicitudes = await this.solicitudPiezaRepository.findBy({
      chofer: { id: chofer.id },
    })

    return solicitudes.map((solicitud) => ({
      estado: solicitud.estado,
      id: solicitud.id,
      cantidad: solicitud.cantidad,
      tipo: solicitud.tipo,
    }))
  }

  async findAll(paginationDto: PaginationSolicitudPiezaDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'tipo',
      search = '',
      column = '',
    } = paginationDto

    const query = this.solicitudPiezaRepository
      .createQueryBuilder('solicitudPieza')
      .leftJoinAndSelect('solicitudPieza.chofer', 'chofer')
      .leftJoinAndSelect('chofer.vehiculo', 'vehiculo')
      .leftJoinAndSelect('chofer.user', 'user')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(
        sorting === 'vehiculo'
          ? `vehiculo.matricula`
          : `solicitudPieza.${sorting}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (search !== '' && column !== '') {
      query.where(
        column === 'vehiculo'
          ? `CAST(vehiculo.matricula AS TEXT) ILIKE(:search)`
          : `CAST(solicitudPieza.${column} AS TEXT) ILIKE(:search)`,
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
  async findOne(id: string) {
    const solicitudPieza = await this.solicitudPiezaRepository.findOneBy({
      id,
    })
    if (!solicitudPieza)
      throw new NotFoundException('Solicitud de pieza no encontrada')
    return solicitudPieza
  }
  async create(
    userId: string,
    createSolicitudPiezaDto: CreateSolicitudPiezaDto,
  ) {
    const solicitudPieza = this.solicitudPiezaRepository.create(
      createSolicitudPiezaDto,
    )
    const chofer = await this.choferService.findOneByUserId(userId)
    solicitudPieza.chofer = chofer
    return this.solicitudPiezaRepository.save(solicitudPieza)
  }
  async update(id: string, updateSolicitudPiezaDto: UpdateSolicitudPiezaDto) {
    const solicitudPieza = await this.findOne(id)
    try {
      Object.assign(solicitudPieza, updateSolicitudPiezaDto)
      return await this.solicitudPiezaRepository.save(solicitudPieza)
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async removeOne(userId: string, solicitudPiezaId: string) {
    const solicitudPieza = await this.findOne(solicitudPiezaId)
    const chofer = await this.choferService.findOneByUserId(userId)

    if (solicitudPieza.chofer.id !== chofer.id) {
      throw new UnauthorizedException(
        'La solicitud de pieza no pertenece al chofer',
      )
    }
    if (solicitudPieza.estado !== 'pendiente') {
      throw new BadRequestException(
        'Solo se pueden eliminar solicitudes de piezas en estado pendiente',
      )
    }

    await this.solicitudPiezaRepository.delete({ id: solicitudPiezaId })
    return 'Solicitud de pieza eliminada correctamente'
  }
  async removeMany(ids: string[], userId: string) {
    const chofer = await this.choferService.findOneByUserId(userId)
    if (chofer) {
      for (const id of ids) {
        this.removeOne(userId, id)
      }
    } else {
      const deleteResult = await this.solicitudPiezaRepository.delete({
        id: In(ids),
      })
      if (deleteResult.affected === 0) {
        throw new NotFoundException(
          'No se encontraron solicitudes de piezas con los ids proporcionados',
        )
      }
      if (deleteResult.affected !== ids.length) {
        throw new NotFoundException(
          'No se pudieron eliminar todos los solicitudes de piezas seleccionados',
        )
      }
    }
  }
}
