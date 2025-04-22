import { Module } from '@nestjs/common'
import { UsuarioModule } from './usuario/usuario.module'
import { AdministradorModule } from './administrador/administrador.module'
import { ChoferModule } from './chofer/chofer.module'
import { SuministradorModule } from './suministrador/suministrador.module'

@Module({
  imports: [
    UsuarioModule,
    AdministradorModule,
    ChoferModule,
    SuministradorModule,
  ],
  exports: [
    UsuarioModule,
    AdministradorModule,
    ChoferModule,
    SuministradorModule,
  ],
  controllers: [],
  providers: [],
})
export class PersonalModule {}
