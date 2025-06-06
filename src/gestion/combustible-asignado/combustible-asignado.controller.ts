import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { CombustibleAsignadoService } from './combustible-asignado.service'
import { Auth } from 'src/auth/decorators'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { CreateCombustibleAsignadoDto } from './dtos/create-combustible-asignado.dto'
import { UpdateCombustibleAsignadoDto } from './dtos/update-combustible-asignado.dto'
import { DeleteManyDto } from 'src/common/dtos/delete-many.dto'

@Controller('gestion/combustible-asignado')
export class CombustibleAsignadoController {
  constructor(
    private readonly combustibleAsignadoService: CombustibleAsignadoService,
  ) {}

  @Get('load-combustible-asignado')
  @Auth(ValidRoles.suministrador, ValidRoles.admin)
  loadCombustibleAsignadoFormData() {
    return this.combustibleAsignadoService.loadCombustibleAsignadoPage()
  }
  @Get('this-month-fuel')
  @Auth(ValidRoles.admin)
  thisMonthFuel() {
    return this.combustibleAsignadoService.thisMonthFuel()
  }

  @Get(':id')
  @Auth(ValidRoles.suministrador)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.combustibleAsignadoService.findOne(id)
  }

  @Get()
  @Auth(ValidRoles.suministrador)
  findAll() {
    return this.combustibleAsignadoService.findAll()
  }

  @Delete()
  @Auth(ValidRoles.suministrador)
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.combustibleAsignadoService.removeMany(deleteManyDto.ids)
  }

  @Post(':id')
  @Auth(ValidRoles.suministrador)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCombustibleAsignadoDto: UpdateCombustibleAsignadoDto,
  ) {
    return this.combustibleAsignadoService.update(
      id,
      updateCombustibleAsignadoDto,
    )
  }

  @Post()
  @Auth(ValidRoles.suministrador)
  create(@Body() createCombustibleAsignadoDto: CreateCombustibleAsignadoDto) {
    return this.combustibleAsignadoService.create(createCombustibleAsignadoDto)
  }
}
