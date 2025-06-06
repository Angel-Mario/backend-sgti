import { SolicitudRefuerzoService } from './solicitud-refuerzo.service'
import { SolicitudRefuerzoController } from './solicitud-refuerzo.controller'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SolicitudRefuerzo } from './entities/solicitud-refuerzo.entity'
import { VehiculoModule } from 'src/transportacion/vehiculo/vehiculo.module'
import { ChoferModule } from 'src/personal/chofer/chofer.module'
import { TerminalModule } from 'src/geografico/terminal/terminal.module'

@Module({
  controllers: [SolicitudRefuerzoController],
  imports: [
    TypeOrmModule.forFeature([SolicitudRefuerzo]),
    ChoferModule,
    VehiculoModule,
    TerminalModule,
  ],
  exports: [SolicitudRefuerzoService, TypeOrmModule],
  providers: [SolicitudRefuerzoService],
})
export class SolicitudRefuerzoModule {}
