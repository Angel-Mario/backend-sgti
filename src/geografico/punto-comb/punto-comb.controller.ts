import { DeleteManyIntDto } from 'src/common/dtos/delete-many-int.dto'
import { PuntoCombustibleService } from './punto-comb.service'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'
import { PaginationPuntoCombustibleDto } from './dto/pagination-punto-comb.dto'
import { CreatePuntoCombustibleDto } from './dto/create-punto-comb.dto'
import { UpdatePuntoCombustibleDto } from './dto/update-punto-comb.dto'
import { DeleteWithNoContent } from 'src/common/decorators/delete-with-no-content.decorator'

@Controller('geografico/puntos-combustibles')
export class PuntoCombController {
  constructor(
    private readonly puntoCombustibleService: PuntoCombustibleService,
  ) {}

  @Get()
  findAll(@Query() paginationDto: PaginationPuntoCombustibleDto) {
    return this.puntoCombustibleService.findAll(paginationDto)
  }
  @Get('/simplex/')
  findSimplex() {
    return this.puntoCombustibleService.findSimplex()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.puntoCombustibleService.findOne(id)
  }

  @Post()
  create(@Body() createPuntoCombustibleDto: CreatePuntoCombustibleDto) {
    return this.puntoCombustibleService.create(createPuntoCombustibleDto)
  }

  @Post(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePuntoCombustibleDto: UpdatePuntoCombustibleDto,
  ) {
    return this.puntoCombustibleService.update(id, updatePuntoCombustibleDto)
  }

  @DeleteWithNoContent()
  removeMany(@Body() deleteManyDto: DeleteManyIntDto) {
    return this.puntoCombustibleService.removeMany(deleteManyDto.ids)
  }
}
