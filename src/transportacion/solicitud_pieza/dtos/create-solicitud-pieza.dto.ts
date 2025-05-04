import { IsNotEmpty, IsPositive } from 'class-validator'

export class CreateSolicitudPiezaDto {
  @IsNotEmpty()
  tipo: string

  @IsPositive()
  cantidad: number
}
