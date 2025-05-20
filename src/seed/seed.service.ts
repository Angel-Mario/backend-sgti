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
import { initialData } from './data/seed-data'
import { Terminal } from 'src/geografico/terminal/entities/terminal.entity'
import { TerminalService } from 'src/geografico/terminal/terminal.service'
import { PuntoCombustible } from 'src/geografico/punto-comb/entities/punto-comb.entity'
import { PuntoCombustibleService } from 'src/geografico/punto-comb/punto-comb.service'
import { Averia } from 'src/transportacion/averia/entities/averia.entity'
import { AveriaService } from 'src/transportacion/averia/averia.service'

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
    @InjectRepository(Terminal)
    private readonly terminalRepository: Repository<Terminal>,
    private readonly terminalService: TerminalService,
    @InjectRepository(PuntoCombustible)
    private readonly puntoCombustibleRepository: Repository<PuntoCombustible>,
    private readonly puntoCombustibleService: PuntoCombustibleService,
    @InjectRepository(Averia)
    private readonly averiaRepository: Repository<Averia>,
    private readonly averiaService: AveriaService,
  ) {}

  async rundSeed() {
    await this.deleteTables()
    await this.insertUsers()

    const _adminsIds = await this.insertAdmins()
    console.log(_adminsIds)

    await this.insertPuntosRef()
    await this.insertVehiculos()
    await this.insertRutas()
    await this.insertTerminales()
    await this.insertPuntosCombustibles()

    const _choferesIds = await this.insertChoferes()
    console.log(_choferesIds)

    return 'SEED EXECUTED'
  }
  private async deleteTables() {
    const queryBuilder0 = this.userRepository.createQueryBuilder()
    await queryBuilder0.delete().where({}).execute()

    const queryBuilder1 = this.rutaRepository.createQueryBuilder()
    await queryBuilder1.delete().where({}).execute()

    const queryBuilder2 = this.terminalRepository.createQueryBuilder()
    await queryBuilder2.delete().where({}).execute()

    const queryBuilder3 = this.puntoCombustibleRepository.createQueryBuilder()
    await queryBuilder3.delete().where({}).execute()

    const queryBuilder4 = this.puntoRefRepository.createQueryBuilder()
    await queryBuilder4.delete().where({}).execute()

    const queryBuilder5 = this.averiaRepository.createQueryBuilder()
    await queryBuilder5.delete().where({}).execute()

    const queryBuilder6 = this.vehiculoRepository.createQueryBuilder()
    await queryBuilder6.delete().where({}).execute()
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
  private async insertTerminales() {
    const seedTerminales = initialData.terminales
    const terminales: Promise<string>[] = []
    for (const terminal of seedTerminales) {
      terminales.push(this.terminalService.create(terminal))
    }
    await Promise.all(terminales)
    return 'TERMINALES INSERTED'
  }
  private async insertPuntosCombustibles() {
    const seedPuntosCombustibles = initialData.puntosCombustibles
    const puntosCombustibles: Promise<string>[] = []
    for (const puntoCombustible of seedPuntosCombustibles) {
      puntosCombustibles.push(
        this.puntoCombustibleService.create(puntoCombustible),
      )
    }
    await Promise.all(puntosCombustibles)
    return 'PUNTOS COMBUSTIBLES INSERTED'
  }
}
