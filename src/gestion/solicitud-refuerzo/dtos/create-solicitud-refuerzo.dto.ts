import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator'

export class CreateSolicitudRefuerzoDto {
  @IsString()
  @IsNotEmpty()
  terminalNombre: string

  @IsArray()
  @IsString({ each: true, message: 'Each element must be a string' })
  @ArrayNotEmpty({ message: 'Matriculas array cannot be empty' })
  @ArrayMinSize(1, { message: 'At least one matricula must be provided' })
  vehiculosMatriculas: string[]
}
