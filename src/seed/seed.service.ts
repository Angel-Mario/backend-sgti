import { ReporteService } from './../gestion/reporte/reporte.service'
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
import { SolicitudPiezaService } from 'src/transportacion/solicitud_pieza/solicitud-pieza.service'
import { SolicitudPieza } from 'src/transportacion/solicitud_pieza/entities/solicitud-pieza.entity'
import { CombustibleAsignado } from 'src/gestion/combustible-asignado/entities/combustible-asignado.entity'
import { CombustibleAsignadoService } from 'src/gestion/combustible-asignado/combustible-asignado.service'
import { Reporte } from 'src/gestion/reporte/entities/reporte.entity'
import { SolicitudApoyo } from 'src/transportacion/solicitud_apoyo/entities/solicitud-apoyo.entity'
import { SolicitudApoyoService } from 'src/transportacion/solicitud_apoyo/solicitud-apoyo.service'

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
    @InjectRepository(SolicitudPieza)
    private readonly solicitudPiezaRepository: Repository<SolicitudPieza>,
    private readonly solicitudPiezaService: SolicitudPiezaService,
    @InjectRepository(CombustibleAsignado)
    private readonly combustibleAsignadoRepository: Repository<CombustibleAsignado>,
    private readonly combustibleAsignadoService: CombustibleAsignadoService,
    @InjectRepository(Reporte)
    private readonly reporteRepository: Repository<Reporte>,
    private readonly reporteService: ReporteService,
    @InjectRepository(SolicitudApoyo)
    private readonly solicitudApoyoRepository: Repository<SolicitudApoyo>,
    private readonly solicitudApoyoService: SolicitudApoyoService,
  ) {}

  async rundSeed() {
    await this.deleteTables()
    await this.insertUsers()

    const _adminsIds = await this.insertAdmins()
    // console.log(_adminsIds)

    await this.insertPuntosRef()
    await this.insertVehiculos()
    await this.insertRutas()
    await this.insertTerminales()
    await this.insertPuntosCombustibles()
    await this.insertCombustiblesAsignados()

    const choferesUsersIds = await this.insertChoferes()
    console.log(choferesUsersIds)
    await this.insertSolicitudesPieza(choferesUsersIds[0])

    return 'SEED EXECUTED'
  }
  private async deleteTables() {
    const queryBuilder0 = this.solicitudPiezaRepository.createQueryBuilder()
    await queryBuilder0.delete().where({}).execute()

    const queryBuilder1 = this.reporteRepository.createQueryBuilder()
    await queryBuilder1.delete().where({}).execute()

    const queryBuilder2 = this.solicitudApoyoRepository.createQueryBuilder()
    await queryBuilder2.delete().where({}).execute()

    const queryBuilder3 = this.userRepository.createQueryBuilder()
    await queryBuilder3.delete().where({}).execute()

    const queryBuilder4 = this.rutaRepository.createQueryBuilder()
    await queryBuilder4.delete().where({}).execute()

    const queryBuilder5 = this.terminalRepository.createQueryBuilder()
    await queryBuilder5.delete().where({}).execute()

    const queryBuilder6 = this.puntoCombustibleRepository.createQueryBuilder()
    await queryBuilder6.delete().where({}).execute()

    const queryBuilder7 = this.puntoRefRepository.createQueryBuilder()
    await queryBuilder7.delete().where({}).execute()

    const queryBuilder8 = this.averiaRepository.createQueryBuilder()
    await queryBuilder8.delete().where({}).execute()

    const queryBuilder9 = this.vehiculoRepository.createQueryBuilder()
    await queryBuilder9.delete().where({}).execute()

    const queryBuilder10 =
      this.combustibleAsignadoRepository.createQueryBuilder()
    await queryBuilder10.delete().where({}).execute()
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
  private async insertSolicitudesPieza(id: string) {
    const seedSolicitudesPieza = initialData.solicitudes_pieza
    const solicitudesPieza = []
    for (const solicitudPieza of seedSolicitudesPieza) {
      solicitudesPieza.push(
        this.solicitudPiezaService.create(id, solicitudPieza),
      )
    }
    await Promise.all(solicitudesPieza)
    return 'SOLICITUDES PIEZA INSERTED'
  }
  private async insertCombustiblesAsignados() {
    const seedCombustiblesAsignados = initialData.combustibles_asignados
    const combustiblesAsignados: Promise<string>[] = []
    for (const combustibleAsignado of seedCombustiblesAsignados) {
      combustiblesAsignados.push(
        this.combustibleAsignadoService.create(combustibleAsignado),
      )
    }
    await Promise.all(combustiblesAsignados)
    return 'COMBUSTIBLES ASIGNADOS INSERTED'
  }
}
