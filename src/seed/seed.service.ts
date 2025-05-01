import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/entities/user.entity'
import { PuntoRef } from 'src/geografico/punto-ref/entities/punto-ref.entity'
import { PuntoRefService } from 'src/geografico/punto-ref/punto-ref.service'
import { Ruta } from 'src/geografico/ruta/entities/ruta.entity'
import { RutaService } from 'src/geografico/ruta/ruta.service'
import { ChoferService } from 'src/personal/chofer/chofer.service'
import { Vehiculo } from 'src/transportacion/vehiculo/entities/vehiculo.entity'
import { Repository } from 'typeorm'
import { VehiculoService } from '../transportacion/vehiculo/vehiculo.service'
import { AdministradorService } from './../personal/administrador/administrador.service'
import { UsuarioService } from './../personal/usuario/usuario.service'
// import { administradores } from './data/constants/administradores'
import { initialData } from './data/seed-data'

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usuarioService: UsuarioService,
    private readonly administradorService: AdministradorService,
    private readonly choferService: ChoferService,
    @InjectRepository(PuntoRef)
    private readonly puntoRefRepository: Repository<PuntoRef>,
    private readonly puntoRefService: PuntoRefService,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    private readonly vehiculoService: VehiculoService,
    @InjectRepository(Ruta) private readonly rutaRepository: Repository<Ruta>,
    private readonly rutaService: RutaService,
  ) {}

  async rundSeed() {
    await this.deleteTables()
    await this.insertUsers()

    const _adminsIds = await this.insertAdmins()
    console.log(_adminsIds)

    await this.insertPuntosRef()
    await this.insertVehiculos()
    await this.insertRutas()

    const _choferesIds = await this.insertChoferes()
    console.log(_choferesIds)

    return 'SEED EXECUTED'
  }
  private async deleteTables() {
    const queryBuilder0 = this.userRepository.createQueryBuilder()
    await queryBuilder0.delete().where({}).execute()

    const queryBuilder3 = this.rutaRepository.createQueryBuilder()
    await queryBuilder3.delete().where({}).execute()

    const queryBuilder1 = this.puntoRefRepository.createQueryBuilder()
    await queryBuilder1.delete().where({}).execute()

    const queryBuilder2 = this.vehiculoRepository.createQueryBuilder()
    await queryBuilder2.delete().where({}).execute()
  }

  private async insertUsers() {
    const seedUsers = initialData.users
    const users: Promise<string>[] = []

    for (const user of seedUsers) {
      users.push(this.usuarioService.create(user))
    }
    await Promise.all(users)
    return 'USERS INSERTED'
  }
  private async insertAdmins() {
    return await this.administradorService.createMany(
      initialData.administradores,
    )
  }
  private async insertPuntosRef() {
    const seedPuntosRef = initialData.puntosRef
    const puntosRef: Promise<string>[] = []

    for (const puntoRef of seedPuntosRef) {
      puntosRef.push(this.puntoRefService.create(puntoRef))
    }
    await Promise.all(puntosRef)
    return 'PUNTOSREF INSERTED'
  }
  private async insertVehiculos() {
    const seedVehiculos = initialData.vehiculos
    const vehiculos: Promise<string>[] = []

    for (const vehiculo of seedVehiculos) {
      vehiculos.push(this.vehiculoService.create(vehiculo))
    }
    await Promise.all(vehiculos)
    return 'VEHÍCULOS INSERTED'
  }
  private async insertRutas() {
    const seedRutas = initialData.rutas
    const rutas: Promise<string>[] = []
    for (const ruta of seedRutas) {
      rutas.push(this.rutaService.create(ruta))
    }
    await Promise.all(rutas)
    return 'RUTAS INSERTED'
  }
  private async insertChoferes() {
    return await this.choferService.createMany(initialData.choferes)
  }
}
