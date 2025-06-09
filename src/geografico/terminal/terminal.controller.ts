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
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { Auth } from 'src/auth/decorators'

@Controller('geografico/terminales')
export class TerminalController {
  constructor(private readonly terminalService: TerminalService) {}

  @Auth(ValidRoles.admin)
  @Get()
  findAll(@Query() paginationDto: PaginationTerminalDto) {
    return this.terminalService.findAll(paginationDto)
  }

  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  @Get('/simplex/')
  findSimplex() {
    return this.terminalService.findSimplex()
  }

  @Auth(ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.terminalService.findOne(id)
  }

  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createTerminalDto: CreateTerminalDto) {
    return this.terminalService.create(createTerminalDto)
  }

  @Auth(ValidRoles.admin)
  @Post(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTerminalDto: UpdateTerminalDto,
  ) {
    return this.terminalService.update(id, updateTerminalDto)
  }

  @Auth(ValidRoles.admin)
  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyIntDto) {
    return this.terminalService.removeMany(deleteManyDto.ids)
  }
}
