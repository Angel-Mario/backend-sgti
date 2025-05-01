export interface SeedVehiculo {
  matricula: string
  consumo?: number
  capacidad?: number
  marca?: string
  modelo?: string
  año?: number
}

export const vehiculos: SeedVehiculo[] = [
  {
    matricula: 'ABC123',
    consumo: 5,
    capacidad: 4,
    marca: 'Toyota',
    modelo: 'Corolla',
    año: 2020,
  },
  {
    matricula: 'DEF456',
    consumo: 7,
    capacidad: 6,
    marca: 'Ford',
    modelo: 'Mustang',
    año: 2018,
  },
  {
    matricula: 'GHI789',
    consumo: 3,
    capacidad: 5,
    marca: 'Chevrolet',
    modelo: 'Camaro',
    año: 2019,
  },
  {
    matricula: 'JKL012',
    consumo: 6,
    capacidad: 7,
    marca: 'Dodge',
  },
]
