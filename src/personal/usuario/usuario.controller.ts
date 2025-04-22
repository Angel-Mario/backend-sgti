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
import { UsuarioService } from './usuario.service'
import { PaginationUsuarioDto } from './dtos/pagination-usuario.dto'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'

@Controller('personal/usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationUsuarioDto) {
    return this.usuarioService.findAll(paginationDto)
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuarioService.findOne(id)
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usuarioService.create(createUserDto)
  }

  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usuarioService.update(id, updateUserDto)
  }

  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.usuarioService.remove(id);
  // }

  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.usuarioService.removeMany(deleteManyDto.ids)
  }
}
