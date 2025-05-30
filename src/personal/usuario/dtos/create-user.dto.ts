import {
  IsArray,
  IsEmail,
  IsEnum,
  IsLowercase,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'

export class CreateUserDto {
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

  @Length(8, 8)
  @IsString()
  @IsOptional()
  telefono?: string

  @IsOptional()
  @IsArray()
  @IsEnum(ValidRoles, { each: true })
  roles?: string[]
}
