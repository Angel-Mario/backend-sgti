import { administradores, type SeedAdministrador } from './constants'
import { vehiculos, type SeedVehiculo } from './constants'
import { usuarios, type SeedUser } from './constants'
import { puntosRef, type SeedPuntoRef } from './constants'
import { rutas, type SeedRuta } from './constants'
import { choferes, type SeedChofer } from './constants'
import { terminales, type SeedTerminal } from './constants'
import { puntosCombustibles, type SeedPuntoCombustible } from './constants'

interface SeedData {
  users: SeedUser[]
  administradores: SeedAdministrador[]
  choferes: SeedChofer[]
  puntosRef: SeedPuntoRef[]
  vehiculos: SeedVehiculo[]
  rutas: SeedRuta[]
  terminales: SeedTerminal[]
  puntosCombustibles: SeedPuntoCombustible[]
}

export const initialData: SeedData = {
  users: usuarios,
  administradores: administradores,
  choferes: choferes,
  puntosRef: puntosRef,
  vehiculos: vehiculos,
  rutas: rutas,
  terminales: terminales,
  puntosCombustibles: puntosCombustibles,
}
