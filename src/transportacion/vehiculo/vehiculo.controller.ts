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
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { Auth } from 'src/auth/decorators'

@Controller('vehicular/vehiculos')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationVehiculoDto) {
    return this.vehiculoService.findAll(paginationDto)
  }

  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  @Get('/simplex/')
  findSimplex() {
    return this.vehiculoService.findAllSimplex()
  }

  @Auth(ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiculoService.findOne(id)
  }

  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createvehiculoDto: CreateVehiculoDto) {
    return this.vehiculoService.create(createvehiculoDto)
  }

  @Auth(ValidRoles.admin)
  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatevehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculoService.update(id, updatevehiculoDto)
  }

  @Auth(ValidRoles.admin)
  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.vehiculoService.removeMany(deleteManyDto.ids)
  }
}
