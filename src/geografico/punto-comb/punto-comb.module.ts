import { PuntoCombService } from './punto-comb.service'
import { PuntoCombController } from './punto-comb.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [PuntoCombController],
  providers: [PuntoCombService],
})
export class PuntoCombModule {}
