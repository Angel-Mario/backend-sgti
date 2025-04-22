import { Module } from '@nestjs/common'
import { SuministradorController } from './suministrador.controller'
import { SuministradorService } from './suministrador.service'

import { TypeOrmModule } from '@nestjs/typeorm'
import { Suministrador } from './entities/suministrador.entity'
import { User } from 'src/auth/entities/user.entity'

@Module({
  controllers: [SuministradorController],
  imports: [TypeOrmModule.forFeature([Suministrador, User])],
  providers: [SuministradorService],
  exports: [SuministradorService],
})
export class SuministradorModule {}
