import { IsNotEmpty, IsString } from 'class-validator'

export class CreateProtocoloDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string

  @IsString()
  @IsNotEmpty()
  nombre: string

  @IsString()
  @IsNotEmpty()
  medidas: string
}
