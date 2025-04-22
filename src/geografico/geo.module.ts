import { Module } from '@nestjs/common'
import { RutaModule } from './ruta/ruta.module'
import { PuntoRefModule } from './punto-ref/punto-ref.module'

@Module({
  imports: [RutaModule, PuntoRefModule],
  exports: [RutaModule, PuntoRefModule],
  controllers: [],
  providers: [],
})
export class GeoModule {}
