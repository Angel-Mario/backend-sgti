import { TypeOrmModule } from '@nestjs/typeorm'
import { ReporteController } from './reporte.controller'
import { ReporteService } from './reporte.service'
import { Module } from '@nestjs/common'
import { AdministradorModule } from 'src/personal/administrador/administrador.module'
import { Reporte } from './entities/reporte.entity'

@Module({
  controllers: [ReporteController],
  imports: [TypeOrmModule.forFeature([Reporte]), AdministradorModule],
  exports: [ReporteService, TypeOrmModule],
  providers: [ReporteService],
})
export class ReporteModule {}
