import { Type } from 'class-transformer'
import { IsEnum, IsOptional, Min } from 'class-validator'

const COLUMNS_NAME = [
  'id',
  'complejidad',
  'descripcion',
  'tipo',
  'piezas_necesarias',
  'vehiculo.matricula',
]

export class PaginationAveriaDto {
  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Order must be asc or desc' })
  order?: string

  @IsEnum(COLUMNS_NAME, { message: 'Invalid sorting option' })
  @IsOptional()
  sorting?: string

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number

  @IsOptional()
  @Min(5)
  @Type(() => Number)
  pageSize?: number

  @IsEnum(COLUMNS_NAME, { message: 'Invalid filtering option' })
  @IsOptional()
  column?: string

  @IsOptional()
  search?: string
}
