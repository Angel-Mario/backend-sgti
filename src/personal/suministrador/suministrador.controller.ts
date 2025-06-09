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
import { SuministradorService } from './suministrador.service'
import { PaginationSuministradorDto } from './dtos/pagination-suministrador.dto'
import { CreateSuministradorDto } from './dtos/create-suministrador.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
import { UpdateSuministradorDto } from './dtos/update-suministrador.dto'
import { Auth } from 'src/auth/decorators'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'

@Controller('personal/suministradores')
export class SuministradorController {
  constructor(private readonly suministradorService: SuministradorService) {}

  @Auth(ValidRoles.admin)
  @Get()
  findAll(@Query() paginationDto: PaginationSuministradorDto) {
    return this.suministradorService.findAll(paginationDto)
  }

  @Auth(ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.suministradorService.findOne(id)
  }

  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createSuministradorDto: CreateSuministradorDto) {
    return this.suministradorService.create(createSuministradorDto)
  }

  @Auth(ValidRoles.admin)
  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSuministradorDto: UpdateSuministradorDto,
  ) {
    return this.suministradorService.update(id, updateSuministradorDto)
  }

  @Auth(ValidRoles.admin)
  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.suministradorService.removeMany(deleteManyDto.ids)
  }
}
