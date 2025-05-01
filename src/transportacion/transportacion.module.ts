import { Module } from '@nestjs/common'
import { VehiculoModule } from './vehiculo/vehiculo.module'
import { AveriaModule } from './averia/averia.module'
import { SolicitudPiezaModule } from './solicitud_pieza/solicitud-pieza.module'

@Module({
  imports: [VehiculoModule, AveriaModule, SolicitudPiezaModule],
  exports: [VehiculoModule, AveriaModule, SolicitudPiezaModule],
  controllers: [],
  providers: [],
})
export class TransportacionModule {}
