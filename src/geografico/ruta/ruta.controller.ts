import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
import { CreateRutaDto } from './dtos/create-ruta.dto'
import { PaginationRutaDto } from './dtos/pagination-ruta.dto'
import { RutaService } from './ruta.service'
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
import { UpdateRutaDto } from './dtos/update-ruta.dto'

@Controller('geografico/rutas')
export class RutaController {
  constructor(private readonly rutaService: RutaService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationRutaDto) {
    return this.rutaService.findAll(paginationDto)
  }
  @Get('/simplex/')
  findSimplex() {
    return this.rutaService.findSimplex()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rutaService.findOne(id)
  }

  @Post()
  create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutaService.create(createRutaDto)
  }

  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRutaDto: UpdateRutaDto,
  ) {
    return this.rutaService.update(id, updateRutaDto)
  }

  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.rutaService.removeMany(deleteManyDto.ids)
  }
}
