import { AveriaController } from './averia.controller'
import { Module } from '@nestjs/common'
import { AveriaService } from './averia.service'

@Module({
  imports: [],
  controllers: [AveriaController],
  providers: [AveriaService],
})
export class AveriaModule {}
