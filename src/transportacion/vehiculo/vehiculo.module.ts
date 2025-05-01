import { Vehiculo } from './entities/vehiculo.entity'
import { VehiculoController } from './vehiculo.controller'
import { VehiculoService } from './vehiculo.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  controllers: [VehiculoController],
  imports: [TypeOrmModule.forFeature([Vehiculo])],
  exports: [VehiculoService, TypeOrmModule],
  providers: [VehiculoService],
})
export class VehiculoModule {}
