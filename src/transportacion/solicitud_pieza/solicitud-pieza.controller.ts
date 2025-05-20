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
import { SolicitudPiezaService } from './solicitud-pieza.service'
import { Auth } from 'src/auth/decorators'
import { UserId } from 'src/common/decorators/user-id.decorator'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { CreateSolicitudPiezaDto } from './dtos/create-solicitud-pieza.dto'
import { PaginationSolicitudPiezaDto } from './dtos/pagination-solicitud-pieza.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'

@Controller('vehicular/solicitudes-piezas')
export class SolicitudPiezaController {
  constructor(private readonly solicitudPiezaService: SolicitudPiezaService) {}

  @Get('load-solicitud-pieza-form-data')
  @Auth(ValidRoles.chofer)
  loadSolicitudPiezaFormData(@UserId() id: string) {
    return this.solicitudPiezaService.loadSolicitudPiezaPage(id)
  }

  @Post()
  @Auth(ValidRoles.chofer)
  create(
    @UserId() id: string,
    @Body() solicitudPiezaDto: CreateSolicitudPiezaDto,
  ) {
    return this.solicitudPiezaService.create(id, solicitudPiezaDto)
  }

  @Get()
  // @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationSolicitudPiezaDto) {
    return this.solicitudPiezaService.findAll(paginationDto)
  }

  @Delete(':id')
  @Auth(ValidRoles.chofer)
  removeOne(
    @Param('id', ParseUUIDPipe) solicitudPiezaId: string,
    @UserId() userId: string,
  ) {
    return this.solicitudPiezaService.removeOne(userId, solicitudPiezaId)
  }

  @Delete()
  @Auth(ValidRoles.admin)
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.solicitudPiezaService.removeMany(deleteManyDto.ids)
  }
}
