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
import { SolicitudApoyoService } from './solicitud-apoyo.service'
import { Auth } from 'src/auth/decorators'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { UserId } from 'src/common/decorators/user-id.decorator'
import { CreateSolicitudApoyoDto } from './dtos/create-solicitud-apoyo.dto'
import { PaginationSolicitudApoyoDto } from './dtos/pagination-solicitud-apoyo.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'

@Controller('vehicular/solicitudes-apoyo')
export class SolicitudApoyoController {
  constructor(private readonly solicitudApoyoService: SolicitudApoyoService) {}

  @Get('load-solicitud-apoyo-form-data')
  @Auth(ValidRoles.chofer)
  loadSolicitudApoyoFormData(@UserId() id: string) {
    return this.solicitudApoyoService.loadSolicitudApoyoPage(id)
  }

  @Post()
  @Auth(ValidRoles.chofer)
  create(
    @UserId() id: string,
    @Body() solicitudApoyoDto: CreateSolicitudApoyoDto,
  ) {
    return this.solicitudApoyoService.create(id, solicitudApoyoDto)
  }
  @Get()
  // @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationSolicitudApoyoDto) {
    return this.solicitudApoyoService.findAll(paginationDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.solicitudApoyoService.findOne(id)
  }

  @Delete(':id')
  @Auth(ValidRoles.chofer)
  removeOne(
    @Param('id', ParseUUIDPipe) solicitudApoyoId: string,
    @UserId() userId: string,
  ) {
    return this.solicitudApoyoService.removeOne(userId, solicitudApoyoId)
  }

  @Delete()
  @Auth(ValidRoles.chofer)
  removeMany(@Body() deleteManyDto: DeleteManyDto, @UserId() userId: string) {
    return this.solicitudApoyoService.removeMany(deleteManyDto.ids, userId)
  }
}
