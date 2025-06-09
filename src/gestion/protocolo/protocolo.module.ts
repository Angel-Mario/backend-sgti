import { ProtocoloService } from './protocolo.service'
import { ProtocoloController } from './protocolo.controller'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Protocolo } from './entities/protocolo.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Protocolo])],
  exports: [ProtocoloService, TypeOrmModule],
  controllers: [ProtocoloController],
  providers: [ProtocoloService],
})
export class ProtocoloModule {}
