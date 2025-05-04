import { IsEnum, IsString } from 'class-validator'

export class ChangeStateSolicitudPiezaDto {
  @IsEnum(['pendiente', 'aceptado', 'rechazado'])
  @IsString()
  estado: string
}
