import {
  combustibles_asignados,
  SeedCombustibleAsignado,
  solicitudes_pieza,
  type SeedSolicitudPieza,
} from './constants'
import { administradores, type SeedAdministrador } from './constants'
import { vehiculos, type SeedVehiculo } from './constants'
import { usuarios, type SeedUser } from './constants'
import { puntosRef, type SeedPuntoRef } from './constants'
import { rutas, type SeedRuta } from './constants'
import { choferes, type SeedChofer } from './constants'
import { terminales, type SeedTerminal } from './constants'
import { puntosCombustibles, type SeedPuntoCombustible } from './constants'

interface SeedData {
  combustibles_asignados: SeedCombustibleAsignado[]
  users: SeedUser[]
  administradores: SeedAdministrador[]
  choferes: SeedChofer[]
  puntosRef: SeedPuntoRef[]
  vehiculos: SeedVehiculo[]
  rutas: SeedRuta[]
  terminales: SeedTerminal[]
  puntosCombustibles: SeedPuntoCombustible[]
  solicitudes_pieza: SeedSolicitudPieza[]
}

export const initialData: SeedData = {
  combustibles_asignados: combustibles_asignados,
  users: usuarios,
  administradores: administradores,
  choferes: choferes,
  puntosRef: puntosRef,
  vehiculos: vehiculos,
  rutas: rutas,
  terminales: terminales,
  puntosCombustibles: puntosCombustibles,
  solicitudes_pieza: solicitudes_pieza,
}
