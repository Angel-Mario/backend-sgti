import { CombustibleAsignadoService } from './combustible-asignado.service'
import { CombustibleAsignadoController } from './combustible-asignado.controller'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CombustibleAsignado } from './entities/combustible-asignado.entity'

@Module({
  controllers: [CombustibleAsignadoController],
  imports: [TypeOrmModule.forFeature([CombustibleAsignado])],
  exports: [CombustibleAsignadoService, TypeOrmModule],
  providers: [CombustibleAsignadoService],
})
export class CombustibleAsignadoModule {}
