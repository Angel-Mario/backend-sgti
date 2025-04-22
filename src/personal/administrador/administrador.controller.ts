import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { PaginationAdministradorDto } from './dtos/pagination-admin.dto';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';

@Controller('personal/administradores')
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationAdministradorDto) {
    return this.administradorService.findAll(paginationDto);
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.administradorService.findOne(id);
  }
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.administradorService.create(createAdminDto);
  }
  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.administradorService.update(id, updateAdminDto);
  }

  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.administradorService.removeMany(deleteManyDto.ids);
  }
}
