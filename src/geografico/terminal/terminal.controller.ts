import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'
import { TerminalService } from './terminal.service'
import { CreateTerminalDto } from './dto/create-terminal.dto'
import { PaginationTerminalDto } from './dto/pagination-terminal.dto'
import { UpdateTerminalDto } from './dto/update-terminal.dto'
import { DeleteManyIntDto } from 'src/common/dtos/delete-many-int.dto'

@Controller('geografico/terminales')
export class TerminalController {
  constructor(private readonly terminalService: TerminalService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationTerminalDto) {
    return this.terminalService.findAll(paginationDto)
  }
  @Get('/simplex/')
  findSimplex() {
    return this.terminalService.findSimplex()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.terminalService.findOne(id)
  }

  @Post()
  create(@Body() createTerminalDto: CreateTerminalDto) {
    return this.terminalService.create(createTerminalDto)
  }

  @Post(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTerminalDto: UpdateTerminalDto,
  ) {
    return this.terminalService.update(id, updateTerminalDto)
  }

  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyIntDto) {
    return this.terminalService.removeMany(deleteManyDto.ids)
  }
}
