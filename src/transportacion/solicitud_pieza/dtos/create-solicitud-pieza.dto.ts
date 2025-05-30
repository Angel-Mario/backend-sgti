import { IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class CreateSolicitudPiezaDto {
  @IsNotEmpty()
  @IsString()
  tipo: string

  @IsPositive()
  cantidad: number
}
