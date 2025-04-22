import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsPositive,
} from 'class-validator'

export class DeleteManyDtoNumber {
  @IsArray()
  @IsPositive({ each: true })
  @ArrayNotEmpty({ message: 'IDs array cannot be empty' })
  @ArrayMinSize(1, { message: 'At least one ID must be provided' })
  ids: number[]
}
