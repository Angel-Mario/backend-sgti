import { Module } from '@nestjs/common'
import { AveriaModule } from './averia/averia.module'
import { SolicitudApoyoModule } from './solicitud_apoyo/solicitud-apoyo.module'
import { SolicitudPiezaModule } from './solicitud_pieza/solicitud-pieza.module'
import { VehiculoModule } from './vehiculo/vehiculo.module'

@Module({
  imports: [
    VehiculoModule,
    AveriaModule,
    SolicitudPiezaModule,
    SolicitudApoyoModule,
  ],
  exports: [
    VehiculoModule,
    AveriaModule,
    SolicitudPiezaModule,
    SolicitudApoyoModule,
  ],
  controllers: [],
  providers: [],
})
export class TransportacionModule {}
