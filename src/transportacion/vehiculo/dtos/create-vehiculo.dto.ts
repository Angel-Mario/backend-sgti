import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator'

export class CreateVehiculoDto {
  @IsString()
  @MinLength(4)
  matricula: string

  @IsOptional()
  @IsPositive()
  consumo?: number

  @IsOptional()
  @IsPositive()
  @IsInt()
  capacidad?: number

  @IsString()
  marca?: string

  @IsOptional()
  @IsString()
  modelo?: string

  @IsOptional()
  @IsInt()
  @IsPositive()
  año?: number
}
