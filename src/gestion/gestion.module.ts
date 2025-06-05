import { Module } from '@nestjs/common'
import { ReporteModule } from './reporte/reporte.module'
import { CombustibleAsignadoModule } from './combustible-asignado/combustible-asignado.module'
import { SolicitudRefuerzoModule } from './solicitud-refuerzo/solicitud-refuerzo.module'

@Module({
  imports: [CombustibleAsignadoModule, ReporteModule, SolicitudRefuerzoModule],
  exports: [CombustibleAsignadoModule, ReporteModule, SolicitudRefuerzoModule],
  controllers: [],
  providers: [],
})
export class GestionModule {}
