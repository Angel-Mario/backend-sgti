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
import { VehiculoService } from './vehiculo.service'
import { PaginationVehiculoDto } from './dtos/pagination-vehiculo.dto'
import { CreateVehiculoDto } from './dtos/create-vehiculo.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
import { UpdateVehiculoDto } from './dtos/update-vehiculo.dto'

@Controller('vehicular/vehiculos')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationVehiculoDto) {
    return this.vehiculoService.findAll(paginationDto)
  }
  @Get('/simplex/')
  findSimplex() {
    return this.vehiculoService.findAllSimplex()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiculoService.findOne(id)
  }

  @Post()
  create(@Body() createvehiculoDto: CreateVehiculoDto) {
    return this.vehiculoService.create(createvehiculoDto)
  }

  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatevehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculoService.update(id, updatevehiculoDto)
  }

  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.vehiculoService.removeMany(deleteManyDto.ids)
  }
}
