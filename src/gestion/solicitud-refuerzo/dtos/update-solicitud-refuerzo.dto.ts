import { IsEnum, IsString } from 'class-validator'

export class UpdateSolicitudRefuerzoDto {
  @IsString()
  @IsEnum(['pendiente', 'aceptada', 'rechazada'])
  estado: string
}
