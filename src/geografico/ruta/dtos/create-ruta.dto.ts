import {
  IsMilitaryTime,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator'

export class CreateRutaDto {
  @IsString()
  nombre: string

  @IsOptional()
  @IsPositive()
  distancia: number

  @IsMilitaryTime()
  hora_salida: string

  @IsMilitaryTime()
  hora_regreso: string

  @IsString()
  puntoSalida: string

  @IsString()
  puntoRegreso: string
}
