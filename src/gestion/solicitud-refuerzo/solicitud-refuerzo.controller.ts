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
import { UpdateSolicitudRefuerzoDto } from './dtos/update-solicitud-refuerzo.dto'

@Controller('gestion/solicitud-refuerzo')
export class SolicitudRefuerzoController {
  constructor(private service: SolicitudRefuerzoService) {}

  @Get('/load-form-data/')
  @Auth(ValidRoles.suministrador)
  async solicitudRefuerzoLoadData() {
    return this.service.solicitudRefuerzoLoadData()
  }
  @Get(':id')
  @Auth(ValidRoles.admin)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id)
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  findAll(@Query() paginationDto: PaginationSolicitudRefuerzoDto) {
    return this.service.findAll(paginationDto)
  }

  @Post(':id')
  @Auth(ValidRoles.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSolicitudRefuerzoDto: UpdateSolicitudRefuerzoDto,
  ) {
    return this.service.update(id, updateSolicitudRefuerzoDto)
  }

  @Post()
  @Auth(ValidRoles.suministrador)
  async create(@Body() createSolicitudRefuerzoDto: CreateSolicitudRefuerzoDto) {
    return this.service.create(createSolicitudRefuerzoDto)
  }

  @Delete()
  @Auth(ValidRoles.suministrador)
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.service.removeMany(deleteManyDto.ids)
  }
}
