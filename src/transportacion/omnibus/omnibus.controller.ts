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
import { OmnibusService } from './omnibus.service'
import { PaginationOmnibusDto } from './dtos/pagination-omnibus.dto'
import { CreateOmnibusDto } from './dtos/create-omnibus.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
import { UpdateOmnibusDto } from './dtos/update-omnibus.dto'

@Controller('vehicular/omnibus')
export class VehiculoController {
  constructor(private readonly omnibusService: OmnibusService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationOmnibusDto) {
    return this.omnibusService.findAll(paginationDto)
  }
  @Get('/simplex/')
  findSimplex() {
    return this.omnibusService.findAllSimplex()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.omnibusService.findOne(id)
  }

  @Post()
  create(@Body() createOmnibusDto: CreateOmnibusDto) {
    return this.omnibusService.create(createOmnibusDto)
  }

  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOmnibusDto: UpdateOmnibusDto,
  ) {
    return this.omnibusService.update(id, updateOmnibusDto)
  }

  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.omnibusService.removeMany(deleteManyDto.ids)
  }
}
