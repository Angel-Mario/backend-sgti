export interface SeedUser {
  nombre_u: string
  fullName: string
  password: string
  correo: string
  roles: string[]
  carnet: number
}

export const usuarios: SeedUser[] = [
  {
    nombre_u: 'admin',
    fullName: 'Admin',
    password: 'Admin12345*',
    correo: 'admin@uci.cu',
    roles: ['admin'],
    carnet: 10000000000,
  },
  {
    nombre_u: 'chofer',
    fullName: 'Chofer',
    password: 'Chofer12345*',
    correo: 'chofer@uci.cu',
    roles: ['chofer'],
    carnet: 10000000001,
  },
  {
    nombre_u: 'suministrador',
    fullName: 'Suministrador',
    password: 'Sumin12345#',
    correo: 'suministrador@uci.cu',
    roles: ['suministrador'],
    carnet: 10000000002,
  },
]
