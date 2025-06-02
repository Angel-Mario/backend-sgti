import { CombustibleAsignadoService } from './combustible-asignado.service'
import { CombustibleAsignadoController } from './combustible-asignado.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [CombustibleAsignadoController],
  providers: [CombustibleAsignadoService],
})
export class CombustibleAsignadoModule {}
