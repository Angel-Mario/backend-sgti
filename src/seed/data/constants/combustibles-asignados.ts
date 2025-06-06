export interface SeedCombustibleAsignado {
  fecha: Date
  cantidadL: number
}

export const combustibles_asignados: SeedCombustibleAsignado[] = [
  {
    fecha: new Date(2025, 5, 1),
    cantidadL: 10,
  },
  {
    fecha: new Date(2025, 5, 2),
    cantidadL: 20,
  },
  {
    fecha: new Date(2025, 5, 3),
    cantidadL: 30,
  },
  {
    fecha: new Date(2025, 5, 4),
    cantidadL: 40,
  },
  {
    fecha: new Date(2025, 5, 5),
    cantidadL: 50,
  },
  {
    fecha: new Date(2025, 5, 10),
    cantidadL: 100,
  },
  {
    fecha: new Date(2025, 6, 6),
    cantidadL: 60,
  },
]
