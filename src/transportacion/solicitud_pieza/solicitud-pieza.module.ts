import { TypeOrmModule } from '@nestjs/typeorm'
import { SolicitudPiezaController } from './solicitud-pieza.controller'
import { SolicitudPiezaService } from './solicitud-pieza.service'
import { Module } from '@nestjs/common'

@Module({
  controllers: [SolicitudPiezaController],
  imports: [TypeOrmModule.forFeature([SolicitudPiezaService])],
  exports: [SolicitudPiezaService],
  providers: [SolicitudPiezaService],
})
export class SolicitudPiezaModule {}
