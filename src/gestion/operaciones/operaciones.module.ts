import { OperacionesService } from './operaciones.service'
import { OperacionesController } from './operaciones.controller'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Operacion } from './entities/operacion.entity'
import { ProtocoloModule } from '../protocolo/protocolo.module'

@Module({
  controllers: [OperacionesController],
  imports: [TypeOrmModule.forFeature([Operacion]), ProtocoloModule],
  exports: [OperacionesService, TypeOrmModule],
  providers: [OperacionesService],
})
export class OperacionesModule {}
