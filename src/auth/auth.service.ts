import { LoginUserDto } from './dto/login-user.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, nombre_u } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { nombre_u: nombre_u },
        select: { password: true, nombre_u: true, id: true, roles: true },
      });

      if (!user)
        throw new UnauthorizedException('credentials are not valid (nombre_u)');

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('credentials are not valid (password)');

      delete user.password;
      return { ...user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      this.handelDBErrors(error);
    }
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handelDBErrors(error: any): never {
    if (error.code == 23505) throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Check logs');
  }
}
