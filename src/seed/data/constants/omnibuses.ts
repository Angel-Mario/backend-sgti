export interface SeedOmnibus {
  chapa: string
  consumo?: number
  capacidad?: number
  marca?: string
  modelo?: string
  año?: number
}

export const omnibuses: SeedOmnibus[] = [
  {
    chapa: 'ABC123',
    consumo: 5,
    capacidad: 4,
    marca: 'Toyota',
    modelo: 'Corolla',
    año: 2020,
  },
  {
    chapa: 'DEF456',
    consumo: 7,
    capacidad: 6,
    marca: 'Ford',
    modelo: 'Mustang',
    año: 2018,
  },
  {
    chapa: 'GHI789',
    consumo: 3,
    capacidad: 5,
    marca: 'Chevrolet',
    modelo: 'Camaro',
    año: 2019,
  },
  {
    chapa: 'JKL012',
    consumo: 6,
    capacidad: 7,
    marca: 'Dodge',
  },
]
