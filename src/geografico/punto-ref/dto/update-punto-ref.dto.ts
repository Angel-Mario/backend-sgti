import { PartialType } from '@nestjs/mapped-types'
import { CreatePuntoRefDto } from './create-punto-ref.dto'

export class UpdatePuntoRefDto extends PartialType(CreatePuntoRefDto) {}
