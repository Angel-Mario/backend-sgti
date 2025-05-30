import { IsNotEmpty, IsString } from 'class-validator'

export class CreateReporteDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string
}
