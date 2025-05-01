import { TypeOrmModule } from '@nestjs/typeorm'
import { ChoferController } from './chofer.controller'
import { ChoferService } from './chofer.service'

import { Module } from '@nestjs/common'
import { Chofer } from './entities/chofer.entity'
import { User } from 'src/auth/entities/user.entity'
import { VehiculoModule } from 'src/transportacion/vehiculo/vehiculo.module'
import { RutaModule } from 'src/geografico/ruta/ruta.module'

@Module({
  controllers: [ChoferController],
  imports: [
    TypeOrmModule.forFeature([Chofer, User]),
    VehiculoModule,
    RutaModule,
  ],
  providers: [ChoferService],
  exports: [ChoferService],
})
export class ChoferModule {}
