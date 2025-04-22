import { PartialType } from '@nestjs/mapped-types'
import { CreateChoferDto } from './create-chofer.dto'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateChoferDto extends PartialType(CreateChoferDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
