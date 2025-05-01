import { SolicitudPiezaController } from './solicitud-pieza.controller'
import { SolicitudPiezaService } from './solicitud-pieza.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [SolicitudPiezaController],
  providers: [SolicitudPiezaService],
})
export class SolicitudPiezaModule {}
