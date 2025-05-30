import { TypeOrmModule } from '@nestjs/typeorm'
import { SolicitudPiezaController } from './solicitud-pieza.controller'
import { SolicitudPiezaService } from './solicitud-pieza.service'
import { Module } from '@nestjs/common'
import { ChoferModule } from 'src/personal/chofer/chofer.module'
import { SolicitudPieza } from './entities/solicitud-pieza.entity'

@Module({
  controllers: [SolicitudPiezaController],
  imports: [TypeOrmModule.forFeature([SolicitudPieza]), ChoferModule],
  exports: [SolicitudPiezaService, TypeOrmModule],
  providers: [SolicitudPiezaService],
})
export class SolicitudPiezaModule {}
