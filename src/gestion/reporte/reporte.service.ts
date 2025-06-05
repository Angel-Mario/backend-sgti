import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AdministradorService } from './../../personal/administrador/administrador.service'
import { CreateReporteDto } from './dtos/create-reporte.dto'
import { PaginationReporteDto } from './dtos/pagination-reporte.dto'
import { Reporte } from './entities/reporte.entity'

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepository: Repository<Reporte>,
    private readonly administradorService: AdministradorService,
  ) {}

  async findAll(paginationDto: PaginationReporteDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'fecha',
      search = '',
      column = '',
    } = paginationDto

    const query = this.reporteRepository
      .createQueryBuilder('reporte')
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .orderBy(
        `reporte.${sorting}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (search !== '' && column !== '') {
      query.where(`CAST(reporte.${column} AS TEXT) ILIKE(:search)`, {
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

  async create(id: string, createReporteDto: CreateReporteDto) {
    const reporte = this.reporteRepository.create(createReporteDto)
    reporte.administrador = await this.administradorService.findOneByUserId(id)
    reporte.fecha = new Date()

    return this.reporteRepository.save(reporte)
  }
}
