import { PartialType } from '@nestjs/mapped-types'
import { IsBoolean, IsOptional } from 'class-validator'
import { CreateSuministradorDto } from './create-suministrador.dto'

export class UpdateSuministradorDto extends PartialType(
  CreateSuministradorDto,
) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
