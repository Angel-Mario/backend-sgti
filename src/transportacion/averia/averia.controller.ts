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
import { Auth } from 'src/auth/decorators'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { UserId } from 'src/common/decorators/user-id.decorator'
import { AveriaService } from './averia.service'
import { CreateAveriaDto } from './dtos/create-averia.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
import { PaginationAveriaDto } from './dtos/pagination-averia.dto'

@Controller('vehicular/averias')
export class AveriaController {
  constructor(private readonly averiaService: AveriaService) {}

  @Get('load-averia-form-data')
  @Auth(ValidRoles.chofer)
  loadAveriaFormData(@UserId() id: string) {
    return this.averiaService.loadAveriaPage(id)
  }
  @Post()
  @Auth(ValidRoles.chofer)
  create(@UserId() id: string, @Body() createAveriaDto: CreateAveriaDto) {
    return this.averiaService.create(id, createAveriaDto)
  }
  @Get()
  // @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationAveriaDto) {
    return this.averiaService.findAll(paginationDto)
  }
  @Delete(':id')
  @Auth(ValidRoles.chofer)
  removeOne(
    @Param('id', ParseUUIDPipe) averiaId: string,
    @UserId() userId: string,
  ) {
    return this.averiaService.removeOne(userId, averiaId)
  }

  @Delete()
  @Auth(ValidRoles.admin, ValidRoles.chofer)
  removeMany(@Body() deleteManyDto: DeleteManyDto, @UserId() userId: string) {
    return this.averiaService.removeMany(deleteManyDto.ids, userId)
  }
}
