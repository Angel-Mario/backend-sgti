import { VehiculoController } from './omnibus.controller'
import { OmnibusService } from './omnibus.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {  Omnibus } from './entities/omnibus.entity'

@Module({
  controllers: [VehiculoController],
  imports: [TypeOrmModule.forFeature([Omnibus])],
  exports: [OmnibusService, TypeOrmModule],
  providers: [OmnibusService],
})
export class OmnibusModule {}
