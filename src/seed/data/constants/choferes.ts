export interface SeedChofer {
  nombre_u: string
  fullName: string
  password: string
  correo: string
  telefono?: string
  carnet: number
  residencia?: string
  vehiculoMatricula?: string
  rutaNombre?: string
}

export const choferes: SeedChofer[] = [
  {
    nombre_u: 'juan',
    fullName: 'Juan Perez',
    password: '123456As8',
    correo: 'juan@gmail.com',
    carnet: 10000000021,
    residencia: '1',
    vehiculoMatricula: 'ABC123',
    rutaNombre: 'Ruta 1',
  },
  {
    nombre_u: 'pedro',
    fullName: 'Pedro Perez',
    password: '123456As8',
    correo: 'pedro@gmail.com',
    carnet: 10000000031,
    residencia: '2',
    vehiculoMatricula: 'DEF456',
    rutaNombre: 'Ruta 2',
  },
  {
    nombre_u: 'carlos',
    fullName: 'Carlos Perez',
    password: '123456As8',
    correo: 'carlos@gmail.com',
    carnet: 10000000032,
    residencia: '3',
    vehiculoMatricula: 'GHI789',
    rutaNombre: 'Ruta 3',
  },
]
