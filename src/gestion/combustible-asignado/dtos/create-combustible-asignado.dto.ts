import { IsDate, IsPositive } from 'class-validator'

export class CreateCombustibleAsignadoDto {
  @IsDate()
  fecha: Date

  @IsPositive()
  cantidadL: number
}
