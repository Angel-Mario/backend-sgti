import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'

export class CreateChoferDto {
  //User Shared Atrributes
  @Min(10000000000)
  carnet: number

  @IsString()
  @MinLength(5)
  fullName: string

  @IsString()
  @MinLength(4)
  @IsLowercase()
  nombre_u: string

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string

  @IsString()
  @IsEmail()
  correo: string

  @MinLength(8)
  @IsString()
  @IsOptional()
  telefono?: string

  //Chofer Atributes
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  residencia?: string

  @IsString()
  @IsOptional()
  vehiculoMatricula?: string

  @IsString()
  @IsOptional()
  rutaNombre?: string
}
