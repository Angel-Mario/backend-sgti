import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { LoginUserDto } from './dto/login-user.dto'
import { User } from './entities/user.entity'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async me(id: string) {
    const user = await this.userRepository.findOneBy({ id })
    return user
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, nombre_u } = loginUserDto

      const user = await this.userRepository.findOne({
        where: { nombre_u: nombre_u },
        select: {
          password: true,
          nombre_u: true,
          fullName: true,
          id: true,
          roles: true,
          carnet: true,
          correo: true,
          telefono: true,
        },
      })

      if (!user)
        throw new UnauthorizedException('credentials are not valid (nombre_u)')

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('credentials are not valid (password)')

      user.password = undefined
      return { user: { ...user }, token: this.getJwtToken({ id: user.id }) }
    } catch (error) {
      this.handelDBErrors(error)
    }
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token
  }

  private handelDBErrors(error): never {
    if (error.code === 23505) throw new BadRequestException(error.detail)

    throw error
  }
}
