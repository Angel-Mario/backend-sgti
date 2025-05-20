import { applyDecorators } from '@nestjs/common'
import { Auth } from 'src/auth/decorators'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'

export const AuthAllRoles = () =>
  applyDecorators(
    Auth(ValidRoles.admin),
    Auth(ValidRoles.suministrador),
    Auth(ValidRoles.chofer),
  )
