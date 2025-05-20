import { PartialType } from '@nestjs/mapped-types'
import { CreatePuntoCombustibleDto } from './create-punto-comb.dto'

export class UpdatePuntoCombustibleDto extends PartialType(
  CreatePuntoCombustibleDto,
) {}
