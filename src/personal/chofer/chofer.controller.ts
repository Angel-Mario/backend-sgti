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
import { ChoferService } from './chofer.service'
import { PaginationChoferDto } from './dtos/pagination-chofer.dto'
import { CreateChoferDto } from './dtos/create-chofer.dto'
import { UpdateChoferDto } from './dtos/update-chofer.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
import { Auth } from 'src/auth/decorators'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { UserId } from 'src/common/decorators/user-id.decorator'

@Controller('personal/choferes')
export class ChoferController {
  constructor(private readonly choferService: ChoferService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationChoferDto) {
    return this.choferService.findAll(paginationDto)
  }
  @Get('me')
  @Auth(ValidRoles.chofer)
  me(@UserId() id: string) {
    return this.choferService.me(id)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.choferService.findOne(id)
  }
  @Post()
  create(@Body() createChoferDto: CreateChoferDto) {
    return this.choferService.create(createChoferDto)
  }
  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChoferDto: UpdateChoferDto,
  ) {
    return this.choferService.update(id, updateChoferDto)
  }

  @Delete()
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.choferService.removeMany(deleteManyDto.ids)
  }
}
