import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { Repository } from 'typeorm'
import { LoginUserDto } from './dto/login-user.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
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
  async updateProfile(id: string, updateProfile: UpdateProfileDto) {
    const user = await this.userRepository.findOneBy({ id })

    try {
      Object.assign(user, updateProfile)
      return await this.userRepository.save(user)
    } catch (error) {
      handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
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
      throw new UnauthorizedException('Credenciales inválidos (usuario)')

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales inválidos (contraseña)')

    user.password = undefined
    return { user: { ...user }, token: this.getJwtToken({ id: user.id }) }
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token
  }
}
