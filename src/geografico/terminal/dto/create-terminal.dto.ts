import { IsLatLong, IsPositive, IsString, MinLength } from 'class-validator'
export class CreateTerminalDto {
  @IsString()
  @MinLength(4)
  nombre: string
  @IsLatLong()
  latLong: string
  @IsPositive()
  puntoRef: number
}
