import { RutaService } from './ruta.service'
import { RutaController } from './ruta.controller'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Ruta } from './entities/ruta.entity'
import { PuntoRefModule } from '../punto-ref/punto-ref.module'

@Module({
  controllers: [RutaController],
  imports: [TypeOrmModule.forFeature([Ruta]), PuntoRefModule],
  exports: [RutaService, TypeOrmModule],
  providers: [RutaService],
})
export class RutaModule {}
