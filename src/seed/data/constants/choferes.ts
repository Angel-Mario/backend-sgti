export interface SeedChofer {
  nombre_u: string
  fullName: string
  password: string
  correo: string
  telefono?: string
  carnet: number
  residencia?: string
  omnibusChapa: string
  rutaNombre: string
}

export const choferes: SeedChofer[] = [
  {
    nombre_u: 'Juan',
    fullName: 'Juan Perez',
    password: '123456As8',
    correo: 'juan@gmail.com',
    carnet: 10000000021,
    residencia: '1',
    omnibusChapa: 'ABC123',
    rutaNombre: 'Ruta 1',
  },
  {
    nombre_u: 'Pedro',
    fullName: 'Pedro Perez',
    password: '123456As8',
    correo: 'pedro@gmail.com',
    carnet: 10000000031,
    residencia: '2',
    omnibusChapa: 'DEF456',
    rutaNombre: 'Ruta 2',
  },
  {
    nombre_u: 'Carlos',
    fullName: 'Carlos Perez',
    password: '123456As8',
    correo: 'carlos@gmail.com',
    carnet: 10000000032,
    residencia: '3',
    omnibusChapa: 'GHI789',
    rutaNombre: 'Ruta 2',
  },
]
