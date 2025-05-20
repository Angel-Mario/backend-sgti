import { AdministradorService } from './../../personal/administrador/administrador.service'
import { Injectable } from '@nestjs/common'
import { PaginationReporteDto } from './dtos/pagination-reporte.dto'
import { In, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Reporte } from './entities/reporte.entity'
import { CreateReporteDto } from './dtos/create-reporte.dto'

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
      sorting = 'id',
      search = '',
      column = '',
    } = paginationDto

    return await this.reporteRepository.find()
  }

  async create(id: string, createReporteDto: CreateReporteDto) {
    const reporte = this.reporteRepository.create(createReporteDto)
    reporte.administrador = await this.administradorService.findOne(id)
    reporte.fecha = new Date()

    return this.reporteRepository.save(reporte)
  }
}
