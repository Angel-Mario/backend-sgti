import { ArrayMinSize, ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class DeleteManyDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayNotEmpty({ message: 'IDs array cannot be empty' })
  @ArrayMinSize(1, { message: 'At least one ID must be provided' })
  ids: string[];
}
