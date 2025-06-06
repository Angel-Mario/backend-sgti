import { CombustibleChoferService } from './combustible-chofer.service'
import { CombustibleChoferController } from './combustible-chofer.controller'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CombustibleChofer } from './entities/combustible-chofer.entity'
import { ChoferModule } from 'src/personal/chofer/chofer.module'
import { PuntoCombModule } from 'src/geografico/punto-comb/punto-comb.module'

@Module({
  controllers: [CombustibleChoferController],
  imports: [
    TypeOrmModule.forFeature([CombustibleChofer]),
    ChoferModule,
    PuntoCombModule,
  ],
  exports: [CombustibleChoferService, TypeOrmModule],
  providers: [CombustibleChoferService],
})
export class CombustibleChoferModule {}
