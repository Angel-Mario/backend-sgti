import { Vehiculo } from 'src/transportacion/vehiculo/entities/vehiculo.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('averia')
export class Averia {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  complejidad: string

  @Column('text')
  descripcion: string

  @Column('text', { nullable: true })
  tipo?: string

  @Column('text', { nullable: true })
  piezas_necesarias?: string

  @OneToOne(
    () => Vehiculo,
    (vehiculo) => vehiculo.id,
    { eager: true },
  )
  @JoinColumn()
  vehiculo: Vehiculo
}
