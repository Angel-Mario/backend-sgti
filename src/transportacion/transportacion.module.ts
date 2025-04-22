import { Module } from '@nestjs/common'
import { OmnibusModule } from './omnibus/omnibus.module'
import { AveriaModule } from './averia/averia.module'

@Module({
  imports: [OmnibusModule, AveriaModule],
  exports: [OmnibusModule, AveriaModule],
  controllers: [],
  providers: [],
})
export class TransportacionModule {}
