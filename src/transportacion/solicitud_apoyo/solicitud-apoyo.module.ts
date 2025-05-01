import { Module } from '@nestjs/common'
import { SolicitudApoyoController } from './solicitud-apoyo.controller'
import { SolicitudApoyoService } from './solicitud-apoyo.service'

@Module({
  imports: [],
  controllers: [SolicitudApoyoController],
  providers: [SolicitudApoyoService],
})
export class SolicitudApoyoModule {}
