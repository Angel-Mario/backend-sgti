import { IsString } from 'class-validator'

export class CreateReporteDto {
  @IsString()
  descripcion: string
}
