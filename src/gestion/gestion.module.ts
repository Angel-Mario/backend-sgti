import { Module } from '@nestjs/common'
import { ReporteModule } from './reporte/reporte.module'
import { CombustibleAsignadoModule } from './combustible-asignado/combustible-asignado.module'

@Module({
  imports: [CombustibleAsignadoModule, ReporteModule],
  exports: [CombustibleAsignadoModule, ReporteModule],
  controllers: [],
  providers: [],
})
export class GestionModule {}
