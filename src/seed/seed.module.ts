import { TransportacionModule } from '../transportacion/transportacion.module'
import { SeedService } from './seed.service'
import { AuthModule } from 'src/auth/auth.module'
import { SeedController } from './seed.controller'
import { Module } from '@nestjs/common'
import { PersonalModule } from 'src/personal/personal.module'
import { GeoModule } from 'src/geografico/geo.module'
import { GestionModule } from 'src/gestion/gestion.module'

@Module({
  imports: [
    AuthModule,
    PersonalModule,
    GeoModule,
    TransportacionModule,
    GestionModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
