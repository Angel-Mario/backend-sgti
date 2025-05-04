import { PartialType } from '@nestjs/mapped-types'
import { CreateSolicitudPiezaDto } from './create-solicitud-pieza.dto'

export class UpdateSolicitudPiezaDto extends PartialType(
  CreateSolicitudPiezaDto,
) {}
