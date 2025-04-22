import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

export class CreateOmnibusDto {
  @IsString()
  chapa: string

  @IsOptional()
  @IsPositive()
  consumo?: number

  @IsOptional()
  @IsPositive()
  @IsInt()
  capacidad?: number

  @IsOptional()
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
