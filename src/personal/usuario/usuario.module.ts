import { UsuarioService } from './usuario.service'
import { UsuarioController } from './usuario.controller'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/auth/entities/user.entity'
import { AdministradorModule } from '../administrador/administrador.module'
import { SuministradorModule } from '../suministrador/suministrador.module'
import { ChoferModule } from '../chofer/chofer.module'

@Module({
  controllers: [UsuarioController],
  imports: [
    TypeOrmModule.forFeature([User]),
    AdministradorModule,
    SuministradorModule,
    ChoferModule,
  ],
  exports: [UsuarioService],
  providers: [UsuarioService],
})
export class UsuarioModule {}
