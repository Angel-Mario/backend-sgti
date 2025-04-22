import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/entities/user.entity'
import { PuntoRef } from 'src/geografico/punto-ref/entities/punto-ref.entity'
import { PuntoRefService } from 'src/geografico/punto-ref/punto-ref.service'
import { Ruta } from 'src/geografico/ruta/entities/ruta.entity'
import { RutaService } from 'src/geografico/ruta/ruta.service'
import { ChoferService } from 'src/personal/chofer/chofer.service'
import { Omnibus } from 'src/transportacion/omnibus/entities/omnibus.entity'
import { Repository } from 'typeorm'
import { OmnibusService } from '../transportacion/omnibus/omnibus.service'
import { AdministradorService } from './../personal/administrador/administrador.service'
import { UsuarioService } from './../personal/usuario/usuario.service'
import { administradores } from './data/constants/administradores'
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
    @InjectRepository(Omnibus)
    private readonly omnibusRepository: Repository<Omnibus>,
    private readonly omnibusService: OmnibusService,
    @InjectRepository(Ruta) private readonly rutaRepository: Repository<Ruta>,
    private readonly rutaService: RutaService,
  ) {}

  async rundSeed() {
    await this.deleteTables()
    await this.insertUsers()

    const _adminsIds = await this.insertAdmins()
    console.log(_adminsIds)

    await this.insertPuntosRef()
    await this.insertOmnibuses()
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

    const queryBuilder2 = this.omnibusRepository.createQueryBuilder()
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
  private async insertOmnibuses() {
    const seedOmnibus = initialData.omnibuses
    const omnibuses: Promise<string>[] = []

    for (const omnibus of seedOmnibus) {
      omnibuses.push(this.omnibusService.create(omnibus))
    }
    await Promise.all(omnibuses)
    return 'ÓMNIBUSES INSERTED'
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
