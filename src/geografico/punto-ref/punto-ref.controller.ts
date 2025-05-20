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

@Controller('geografico/puntos-ref')
export class PuntoRefController {
  constructor(private readonly puntoRefService: PuntoRefService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationPuntoRefDto) {
    return this.puntoRefService.findAll(paginationDto)
  }
  @Get('/simplex/')
  findSimplex() {
    return this.puntoRefService.findSimplex()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.puntoRefService.findOne(id)
  }

  @Post()
  create(@Body() createPuntoRefDto: CreatePuntoRefDto) {
    return this.puntoRefService.create(createPuntoRefDto)
  }

  @Post(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePuntoRefDto: UpdatePuntoRefDto,
  ) {
    return this.puntoRefService.update(id, updatePuntoRefDto)
  }

  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyIntDto) {
    return this.puntoRefService.removeMany(deleteManyDto.ids)
  }
}
