import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common'
import { SuministradorService } from './suministrador.service'
import { PaginationSuministradorDto } from './dtos/pagination-suministrador.dto'
import { CreateSuministradorDto } from './dtos/create-suministrador.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
import { UpdateSuministradorDto } from './dtos/update-suministrador.dto'

@Controller('personal/suministradores')
export class SuministradorController {
  constructor(private readonly suministradorService: SuministradorService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationSuministradorDto) {
    return this.suministradorService.findAll(paginationDto)
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.suministradorService.findOne(id)
  }
  @Post()
  create(@Body() createSuministradorDto: CreateSuministradorDto) {
    return this.suministradorService.create(createSuministradorDto)
  }
  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSuministradorDto: UpdateSuministradorDto,
  ) {
    return this.suministradorService.update(id, updateSuministradorDto)
  }

  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.suministradorService.removeMany(deleteManyDto.ids)
  }
}
