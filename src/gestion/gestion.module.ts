import { Module } from '@nestjs/common'
import { ReporteModule } from './reporte/reporte.module'
import { CombustibleAsignadoModule } from './combustible-asignado/combustible-asignado.module'
import { SolicitudRefuerzoModule } from './solicitud-refuerzo/solicitud-refuerzo.module'
import { CombustibleChoferModule } from './combustible-chofer/combustible-chofer.module'
import { OperacionesModule } from './operaciones/operaciones.module'

@Module({
  imports: [
    CombustibleAsignadoModule,
    ReporteModule,
    SolicitudRefuerzoModule,
    CombustibleChoferModule,
    OperacionesModule,
  ],
  exports: [
    CombustibleAsignadoModule,
    ReporteModule,
    SolicitudRefuerzoModule,
    CombustibleChoferModule,
    OperacionesModule,
  ],
  controllers: [],
  providers: [],
})
export class GestionModule {}
