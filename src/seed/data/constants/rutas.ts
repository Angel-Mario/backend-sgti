export interface SeedRuta {
  nombre: string
  distancia: number
  hora_salida: string
  hora_regreso: string
  puntoSalida: string
  puntoRegreso: string
}
export const rutas: SeedRuta[] = [
  {
    nombre: 'Ruta 1',
    distancia: 5,
    hora_salida: '08:00',
    hora_regreso: '17:00',
    puntoSalida: 'Casa',
    puntoRegreso: 'Escuela',
  },
  {
    nombre: 'Ruta 2',
    distancia: 10,
    hora_salida: '09:30',
    hora_regreso: '18:30',
    puntoSalida: 'Parque',
    puntoRegreso: 'Hospital',
  },
]
