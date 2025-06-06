import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common'
import { SolicitudRefuerzoService } from './solicitud-refuerzo.service'
import { CreateSolicitudRefuerzoDto } from './dtos/create-solicitud-refuerzo.dto'
import { Auth } from 'src/auth/decorators'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
import { PaginationSolicitudRefuerzoDto } from './dtos/pagination-solicitud-refuerzo.dto'

@Controller('gestion/solicitud-refuerzo')
export class SolicitudRefuerzoController {
  constructor(private service: SolicitudRefuerzoService) {}

  @Get('/load-form-data/')
  @Auth(ValidRoles.suministrador)
  async solicitudRefuerzoLoadData() {
    return this.service.solicitudRefuerzoLoadData()
  }
  @Get()
  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  findAll(@Query() paginationDto: PaginationSolicitudRefuerzoDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id)
  }

  @Post()
  @Auth(ValidRoles.suministrador)
  async create(@Body() createSolicitudRefuerzoDto: CreateSolicitudRefuerzoDto) {
    return this.service.create(createSolicitudRefuerzoDto)
  }
  @Post('id')
  @Auth(ValidRoles.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSolicitudRefuerzoDto: CreateSolicitudRefuerzoDto,
  ) {
    return this.service.update(id, updateSolicitudRefuerzoDto)
  }

  @Delete()
  @Auth(ValidRoles.suministrador)
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.service.removeMany(deleteManyDto.ids)
  }
}
