import { UserId } from 'src/common/decorators/user-id.decorator'
import { CreateReporteDto } from './dtos/create-reporte.dto'
import { PaginationReporteDto } from './dtos/pagination-reporte.dto'
import { ReporteService } from './reporte.service'
import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { Auth } from 'src/auth/decorators'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'

@Controller('gestion/reportes')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationReporteDto) {
    return this.reporteService.findAll(paginationDto)
  }

  @Post()
  @Auth(ValidRoles.admin)
  create(@UserId() id: string, @Body() createReporteDto: CreateReporteDto) {
    return this.reporteService.create(id, createReporteDto)
  }
}
