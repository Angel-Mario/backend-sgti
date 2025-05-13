import { Module } from '@nestjs/common'
import { RutaModule } from './ruta/ruta.module'
import { PuntoRefModule } from './punto-ref/punto-ref.module'
import { TerminalModule } from './terminal/terminal.module'
import { PuntoCombModule } from './punto-comb/punto-comb.module'

@Module({
  imports: [RutaModule, PuntoRefModule, TerminalModule, PuntoCombModule],
  exports: [RutaModule, PuntoRefModule, TerminalModule, PuntoCombModule],
  controllers: [],
  providers: [],
})
export class GeoModule {}
