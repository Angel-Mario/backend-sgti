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
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { Auth } from 'src/auth/decorators'

@Controller('geografico/rutas')
export class RutaController {
  constructor(private readonly rutaService: RutaService) {}

  @Auth(ValidRoles.admin)
  @Get()
  findAll(@Query() paginationDto: PaginationRutaDto) {
    return this.rutaService.findAll(paginationDto)
  }
  @Auth(ValidRoles.admin)
  @Get('/simplex/')
  findSimplex() {
    return this.rutaService.findSimplex()
  }
  @Auth(ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rutaService.findOne(id)
  }
  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutaService.create(createRutaDto)
  }
  @Auth(ValidRoles.admin)
  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRutaDto: UpdateRutaDto,
  ) {
    return this.rutaService.update(id, updateRutaDto)
  }
  @Auth(ValidRoles.admin)
  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.rutaService.removeMany(deleteManyDto.ids)
  }
}
