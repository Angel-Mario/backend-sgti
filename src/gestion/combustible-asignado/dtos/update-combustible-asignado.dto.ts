import { IsPositive } from 'class-validator'

export class UpdateCombustibleAsignadoDto {
  @IsPositive()
  cantidadL: number
}
