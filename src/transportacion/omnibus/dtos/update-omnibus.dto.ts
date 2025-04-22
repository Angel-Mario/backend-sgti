import { PartialType } from '@nestjs/mapped-types'
import { CreateOmnibusDto } from './create-omnibus.dto'

export class UpdateOmnibusDto extends PartialType(CreateOmnibusDto) {}
