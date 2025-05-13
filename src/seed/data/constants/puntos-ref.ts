export interface SeedPuntoRef {
  nombre: string
  //Latitud Longitud
  latLong: string
}

export const puntosRef: SeedPuntoRef[] = [
  {
    nombre: 'Casa',
    latLong: '19.4326, -98.5076',
  },
  {
    nombre: 'Escuela',
    latLong: '22.991900, -82.466039',
  },
  {
    nombre: 'Parque',
    latLong: '19.4328, -98.5076',
  },
  {
    nombre: 'Hospital',
    latLong: '19.4324, -98.5076',
  },
  {
    nombre: 'Banco',
    latLong: '19.4321, -98.5076',
  },
  {
    nombre: 'Supermercado',
    latLong: '19.4320, -98.5076',
  },
]
