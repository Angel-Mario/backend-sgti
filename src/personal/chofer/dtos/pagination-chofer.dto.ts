import { Type } from 'class-transformer'
import { IsEnum, IsOptional, Min } from 'class-validator'

const COLUMNS_NAME = [
  'id',
  'carnet',
  'correo',
  'fullName',
  'nombre_u',
  'telefono',
  'isActive',
  'residencia',
]

export class PaginationChoferDto {
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
