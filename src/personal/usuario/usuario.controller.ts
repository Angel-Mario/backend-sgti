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
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
// import { Auth } from '../../auth/decorators'
// import { ValidRoles } from '../../auth/interfaces/valid-roles'
import { CreateUserDto } from './dtos/create-user.dto'
import { PaginationUsuarioDto } from './dtos/pagination-usuario.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsuarioService } from './usuario.service'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { Auth } from 'src/auth/decorators'

@Controller('personal/usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Auth(ValidRoles.admin)
  @Get()
  findAll(@Query() paginationDto: PaginationUsuarioDto) {
    return this.usuarioService.findAll(paginationDto)
  }

  @Auth(ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuarioService.findOne(id)
  }

  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usuarioService.create(createUserDto)
  }

  @Auth(ValidRoles.admin)
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

  @Auth(ValidRoles.admin)
  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.usuarioService.removeMany(deleteManyDto.ids)
  }
}
