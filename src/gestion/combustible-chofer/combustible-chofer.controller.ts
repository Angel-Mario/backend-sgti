import { PaginationCombustibleChoferDto } from './dtos/pagination-combustible-chofer.dto'
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
import { CombustibleChoferService } from './combustible-chofer.service'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { Auth } from 'src/auth/decorators'
import { UpdateCombustibleChoferDto } from './dtos/update-combustible-chofer.dto'
import { CreateCombustibleChoferDto } from './dtos/create-combustible-chofer.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'

@Controller('gestion/combustible-chofer')
export class CombustibleChoferController {
  constructor(
    private readonly combustibleChoferService: CombustibleChoferService,
  ) {}
  @Auth(ValidRoles.admin)
  @Get('/load-form-data/')
  loadFormData() {
    return this.combustibleChoferService.loadFormData()
  }

  @Auth(ValidRoles.admin)
  @Get()
  findAll(@Query() paginationDto: PaginationCombustibleChoferDto) {
    return this.combustibleChoferService.findAll(paginationDto)
  }
  @Auth(ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.combustibleChoferService.findOne(id)
  }
  @Auth(ValidRoles.admin)
  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCombustibleChoferDto: UpdateCombustibleChoferDto,
  ) {
    return this.combustibleChoferService.update(id, updateCombustibleChoferDto)
  }

  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createCombustibleChoferDto: CreateCombustibleChoferDto) {
    return this.combustibleChoferService.create(createCombustibleChoferDto)
  }
  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.combustibleChoferService.removeMany(deleteManyDto.ids)
  }
}
