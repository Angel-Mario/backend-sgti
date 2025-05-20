import { TypeOrmModule } from '@nestjs/typeorm'
import { TerminalService } from './terminal.service'
import { TerminalController } from './terminal.controller'
import { Module } from '@nestjs/common'
import { Terminal } from './entities/terminal.entity'
import { PuntoRefModule } from '../punto-ref/punto-ref.module'

@Module({
  imports: [TypeOrmModule.forFeature([Terminal]), PuntoRefModule],
  controllers: [TerminalController],
  exports: [TerminalService, TypeOrmModule],
  providers: [TerminalService],
})
export class TerminalModule {}
