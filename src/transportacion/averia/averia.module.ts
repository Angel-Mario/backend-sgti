import { AveriaController } from './averia.controller'
import { Module } from '@nestjs/common'
import { AveriaService } from './averia.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChoferModule } from 'src/personal/chofer/chofer.module'
import { Averia } from './entities/averia.entity'

@Module({
  controllers: [AveriaController],
  imports: [TypeOrmModule.forFeature([Averia]), ChoferModule],
  exports: [AveriaService, TypeOrmModule],
  providers: [AveriaService],
})
export class AveriaModule {}
