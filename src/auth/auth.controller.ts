import { Body, Controller, Get, Post } from '@nestjs/common'
import { UserId } from 'src/common/decorators/user-id.decorator'
import { AuthService } from './auth.service'
import { Auth, GetUser } from './decorators'
import { LoginUserDto } from './dto/login-user.dto'
import { User } from './entities/user.entity'
import { ValidRoles } from './interfaces/valid-roles'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // register(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.create(createUserDto);
  // }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Get('me')
  @Auth(ValidRoles.admin, ValidRoles.chofer, ValidRoles.suministrador)
  me(@UserId() id: string) {
    return this.authService.me(id)
  }
  @Get('profile')
  @Auth(ValidRoles.admin, ValidRoles.chofer, ValidRoles.suministrador)
  updateProfile(@UserId() id: string, @Body() updateProfile: UpdateProfileDto) {
    return this.authService.updateProfile(id, updateProfile)
  }

  @Get('private')
  @Auth(ValidRoles.admin)
  private(@GetUser() user: User) {
    return { ok: true, message: 'private' }
  }
}
