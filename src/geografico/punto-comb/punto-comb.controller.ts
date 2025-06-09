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
import { Auth } from 'src/auth/decorators'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'

@Controller('geografico/puntos-combustible')
export class PuntoCombController {
  constructor(
    private readonly puntoCombustibleService: PuntoCombustibleService,
  ) {}

  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  @Get()
  findAll(@Query() paginationDto: PaginationPuntoCombustibleDto) {
    return this.puntoCombustibleService.findAll(paginationDto)
  }

  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  @Get('/simplex/')
  findSimplex() {
    return this.puntoCombustibleService.findSimplex()
  }

  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.puntoCombustibleService.findOne(id)
  }

  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  @Post()
  create(@Body() createPuntoCombustibleDto: CreatePuntoCombustibleDto) {
    return this.puntoCombustibleService.create(createPuntoCombustibleDto)
  }

  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  @Post(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePuntoCombustibleDto: UpdatePuntoCombustibleDto,
  ) {
    return this.puntoCombustibleService.update(id, updatePuntoCombustibleDto)
  }

  @Auth(ValidRoles.admin, ValidRoles.suministrador)
  @DeleteWithNoContent()
  removeMany(@Body() deleteManyDto: DeleteManyIntDto) {
    return this.puntoCombustibleService.removeMany(deleteManyDto.ids)
  }
}
