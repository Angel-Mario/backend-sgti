import { UserId } from 'src/common/decorators/user-id.decorator'
import { CreateReporteDto } from './dtos/create-reporte.dto'
import { PaginationReporteDto } from './dtos/pagination-reporte.dto'
import { ReporteService } from './reporte.service'
import { Body, Controller, Get, Post, Query } from '@nestjs/common'

@Controller('gestion/reportes')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationReporteDto) {
    return this.reporteService.findAll(paginationDto)
  }

  @Post()
  create(@UserId() id: string, @Body() createReporteDto: CreateReporteDto) {
    return this.reporteService.create(id, createReporteDto)
  }
}
