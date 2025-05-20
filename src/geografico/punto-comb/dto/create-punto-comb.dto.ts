import { IsString, MinLength } from 'class-validator'
export class CreatePuntoCombustibleDto {
  @IsString()
  @MinLength(4)
  nombre: string
  @IsString()
  @MinLength(4)
  puntoRef: string
}
