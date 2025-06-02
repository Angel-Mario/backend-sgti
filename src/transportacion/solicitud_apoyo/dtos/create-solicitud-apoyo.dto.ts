import { IsLatLong, IsNotEmpty, IsString } from 'class-validator'

export class CreateSolicitudApoyoDto {
  @IsNotEmpty()
  @IsString()
  descripcion: string
  @IsLatLong()
  latLong: string
}
