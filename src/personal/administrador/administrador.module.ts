import { Module } from '@nestjs/common'
import { AdministradorController } from './administrador.controller'
import { AdministradorService } from './administrador.service'

import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/auth/entities/user.entity'
import { Admin } from './entities/administrador.entity'

@Module({
  controllers: [AdministradorController],
  imports: [TypeOrmModule.forFeature([Admin, User])],
  providers: [AdministradorService],
  exports: [AdministradorService],
})
export class AdministradorModule {}
