import { TypeOrmModule } from '@nestjs/typeorm'
import { ChoferController } from './chofer.controller'
import { ChoferService } from './chofer.service'

import { Module } from '@nestjs/common'
import { Chofer } from './entities/chofer.entity'
import { User } from 'src/auth/entities/user.entity'
import { OmnibusModule } from 'src/transportacion/omnibus/omnibus.module'
import { RutaModule } from 'src/geografico/ruta/ruta.module'

@Module({
  controllers: [ChoferController],
  imports: [
    TypeOrmModule.forFeature([Chofer, User]),
    OmnibusModule,
    RutaModule,
  ],
  providers: [ChoferService],
  exports: [ChoferService],
})
export class ChoferModule {}
