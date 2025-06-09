import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'
import { CreateProtocoloDto } from './dtos/create-protocolo.dto'
import { ProtocoloService } from './protocolo.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { Auth } from 'src/auth/decorators'
import { UpdateProtocoloDto } from './dtos/update-protocolo.dto'

@Controller('gestion/protocolo')
export class ProtocoloController {
  constructor(private readonly protocoloService: ProtocoloService) {}

  @Auth(ValidRoles.admin)
  @Get('/simplex/')
  getSimplexProtocolo() {
    return this.protocoloService.getSimplexProtocolo()
  }
  @Auth(ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.protocoloService.findOne(id)
  }
  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createProtocoloDto: CreateProtocoloDto) {
    return this.protocoloService.create(createProtocoloDto)
  }
  @Auth(ValidRoles.admin)
  @Post(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProtocoloDto: UpdateProtocoloDto,
  ) {
    return this.protocoloService.update(id, updateProtocoloDto)
  }
  @Auth(ValidRoles.admin)
  @Delete()
  removeMany(@Body() dto: DeleteManyDto) {
    return this.protocoloService.removeMany(dto.ids)
  }
}
