import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'
import { GeoModule } from './geografico/geo.module'
import { GestionModule } from './gestion/gestion.module'
import { MbtilesModule } from './mbtiles/mbtiles.module'
import { PersonalModule } from './personal/personal.module'
import { SeedModule } from './seed/seed.module'
import { TransportacionModule } from './transportacion/transportacion.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      //disable synchronize in production
    }),
    AuthModule,
    CommonModule,
    PersonalModule,
    TransportacionModule,
    GeoModule,
    GestionModule,
    SeedModule,
    MbtilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
