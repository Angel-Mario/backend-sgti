import { IsEnum } from 'class-validator'

export class UpdateSolicitudPiezaDto {
  @IsEnum(['pendiente', 'aceptada', 'rechazada'])
  estado: string
}
