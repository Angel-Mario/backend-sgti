import { PuntoCombustibleService } from './punto-comb.service'
import { PuntoCombController } from './punto-comb.controller'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PuntoCombustible } from './entities/punto-comb.entity'
import { PuntoRefModule } from '../punto-ref/punto-ref.module'

@Module({
  controllers: [PuntoCombController],
  imports: [TypeOrmModule.forFeature([PuntoCombustible]), PuntoRefModule],
  exports: [PuntoCombustibleService, TypeOrmModule],
  providers: [PuntoCombustibleService],
})
export class PuntoCombModule {}
