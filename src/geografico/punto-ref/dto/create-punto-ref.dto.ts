import { IsLatLong, IsString, MinLength } from 'class-validator'
export class CreatePuntoRefDto {
  @IsString()
  @MinLength(4)
  nombre: string
  @IsLatLong()
  latLong: string
}
