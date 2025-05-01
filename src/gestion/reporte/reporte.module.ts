import { ReporteController } from './reporte.controller'
import { ReporteService } from './reporte.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [ReporteController],
  providers: [ReporteService],
})
export class ReporteModule {}
