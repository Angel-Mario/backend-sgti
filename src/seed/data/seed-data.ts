import { administradores, SeedAdministrador } from './constants'
import { SeedOmnibus, omnibuses } from './constants'
import { usuarios, SeedUser } from './constants'
import { puntosRef, SeedPuntoRef } from './constants'
import { rutas, SeedRuta } from './constants'
import { choferes, SeedChofer } from './constants'

interface SeedData {
  users: SeedUser[]
  administradores: SeedAdministrador[]
  choferes: SeedChofer[]
  puntosRef: SeedPuntoRef[]
  omnibuses: SeedOmnibus[]
  rutas: SeedRuta[]
}

export const initialData: SeedData = {
  users: usuarios,
  administradores: administradores,
  choferes: choferes,
  puntosRef: puntosRef,
  omnibuses: omnibuses,
  rutas: rutas,
}
