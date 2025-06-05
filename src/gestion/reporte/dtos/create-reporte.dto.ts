import { IsNotEmpty, IsString } from 'class-validator'

export class CreateReporteDto {
  @IsString()
  @IsNotEmpty()
  asunto: string

  @IsString()
  @IsNotEmpty()
  texto: string
}
