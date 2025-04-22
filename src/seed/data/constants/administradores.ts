export interface SeedAdministrador {
  nombre_u: string
  fullName: string
  password: string
  correo: string
  telefono?: string
  carnet: number
}

export const administradores: SeedAdministrador[] = [
  {
    nombre_u: 'admindos',
    fullName: 'Admindos',
    password: 'Admin12345*',
    correo: 'admindos@uci.cu',
    carnet: 10000000020,
  },
  {
    nombre_u: 'admintres',
    fullName: 'Admintres',
    password: 'Admin12345*',
    correo: 'admintres@uci.cu',
    carnet: 10000000030,
  },
  {
    nombre_u: 'admincuatro',
    fullName: 'Admincuatro',
    password: 'Admin12345*',
    correo: 'admincuatro@uci.cu',
    carnet: 10000000040,
  },
]
