import { PaginationPuntoRefDto } from './dto/pagination-punto-ref.dto'
import { PuntoRefService } from './punto-ref.service'
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
import { UpdatePuntoRefDto } from './dto/update-punto-ref.dto'
import { CreatePuntoRefDto } from './dto/create-punto-ref.dto'
import { DeleteManyIntDto } from 'src/common/dtos/delete-many-int.dto'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { Auth } from 'src/auth/decorators'

@Controller('geografico/puntos-ref')
export class PuntoRefController {
  constructor(private readonly puntoRefService: PuntoRefService) {}

  @Auth(ValidRoles.admin)
  @Get()
  findAll(@Query() paginationDto: PaginationPuntoRefDto) {
    return this.puntoRefService.findAll(paginationDto)
  }
  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  @Get('/simplex/')
  findSimplex() {
    return this.puntoRefService.findSimplex()
  }

  @Auth(ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.puntoRefService.findOne(id)
  }

  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createPuntoRefDto: CreatePuntoRefDto) {
    return this.puntoRefService.create(createPuntoRefDto)
  }

  @Auth(ValidRoles.admin)
  @Post(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePuntoRefDto: UpdatePuntoRefDto,
  ) {
    return this.puntoRefService.update(id, updatePuntoRefDto)
  }

  @Auth(ValidRoles.admin)
  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyIntDto) {
    return this.puntoRefService.removeMany(deleteManyDto.ids)
  }
}
