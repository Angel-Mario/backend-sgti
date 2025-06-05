import { Body, Controller, Get, Post } from '@nestjs/common'
import { SolicitudRefuerzoService } from './solicitud-refuerzo.service'
import { CreateSolicitudRefuerzoDto } from './dtos/create-solicitud-refuerzo.dto'

@Controller('gestion/solicitud-refuerzo')
export class SolicitudRefuerzoController {
  constructor(private service: SolicitudRefuerzoService) {}
  @Get('/load-form-data/')
  async solicitudRefuerzoLoadData() {
    return this.service.solicitudRefuerzoLoadData()
  }
  @Post()
  async create(@Body() createSolicitudRefuerzoDto: CreateSolicitudRefuerzoDto) {
    return this.service.create(createSolicitudRefuerzoDto)
  }
}
