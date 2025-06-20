import { IsString, MinLength } from 'class-validator'
export class CreateTerminalDto {
  @IsString()
  @MinLength(4)
  nombre: string
  @IsString()
  @MinLength(4)
  puntoRef: string
}
