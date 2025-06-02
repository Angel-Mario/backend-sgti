import { Module } from '@nestjs/common'
import { SolicitudApoyoController } from './solicitud-apoyo.controller'
import { SolicitudApoyoService } from './solicitud-apoyo.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SolicitudApoyo } from './entities/solicitud-apoyo.entity'
import { ChoferModule } from 'src/personal/chofer/chofer.module'

@Module({
  controllers: [SolicitudApoyoController],
  imports: [TypeOrmModule.forFeature([SolicitudApoyo]), ChoferModule],
  exports: [SolicitudApoyoService, TypeOrmModule],
  providers: [SolicitudApoyoService],
})
export class SolicitudApoyoModule {}
