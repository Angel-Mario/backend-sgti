import { PuntoRefService } from './punto-ref.service'
import { PuntoRefController } from './punto-ref.controller'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PuntoRef } from './entities/punto-ref.entity'

@Module({
  controllers: [PuntoRefController],
  imports: [TypeOrmModule.forFeature([PuntoRef])],
  exports: [PuntoRefService, TypeOrmModule],
  providers: [PuntoRefService],
})
export class PuntoRefModule {}
