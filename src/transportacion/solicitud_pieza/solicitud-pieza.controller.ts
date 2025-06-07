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
import { Auth } from 'src/auth/decorators'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { UserId } from 'src/common/decorators/user-id.decorator'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
import { CreateSolicitudPiezaDto } from './dtos/create-solicitud-pieza.dto'
import { PaginationSolicitudPiezaDto } from './dtos/pagination-solicitud-pieza.dto'
import { UpdateSolicitudPiezaDto } from './dtos/update-solictud-pieza.dto'
import { SolicitudPiezaService } from './solicitud-pieza.service'

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

  @Post(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) solicitudPiezaId: string,
    @Body() solicitudPiezaDto: UpdateSolicitudPiezaDto,
  ) {
    return this.solicitudPiezaService.update(
      solicitudPiezaId,
      solicitudPiezaDto,
    )
  }

  @Get()
  @Auth(ValidRoles.admin)
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
  @Auth(ValidRoles.admin, ValidRoles.chofer)
  removeMany(@Body() deleteManyDto: DeleteManyDto, @UserId() userId: string) {
    return this.solicitudPiezaService.removeMany(deleteManyDto.ids, userId)
  }
}
