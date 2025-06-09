import { IsPositive, IsString, MinLength } from 'class-validator'

export class CreateCombustibleChoferDto {
  @IsPositive()
  litros: number
  @IsString()
  @MinLength(4)
  chofer: string
  @IsString()
  @MinLength(4)
  puntoComb: string
}
