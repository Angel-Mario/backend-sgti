import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateAveriaDto {
  @IsString()
  @IsNotEmpty()
  complejidad: string

  @IsString()
  descripcion: string

  @IsString()
  @IsOptional()
  tipo?: string

  @IsString()
  @IsOptional()
  piezas_necesarias?: string
}
