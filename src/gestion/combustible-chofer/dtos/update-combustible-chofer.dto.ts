import { IsOptional, IsPositive, IsString, MinLength } from 'class-validator'

export class UpdateCombustibleChoferDto {
  @IsOptional()
  @IsPositive()
  litros?: number
  @IsOptional()
  @IsString()
  @MinLength(4)
  puntoComb?: string
}
