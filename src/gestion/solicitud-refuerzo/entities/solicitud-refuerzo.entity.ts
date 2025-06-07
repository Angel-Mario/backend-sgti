import { Terminal } from 'src/geografico/terminal/entities/terminal.entity'
import { Vehiculo } from 'src/transportacion/vehiculo/entities/vehiculo.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm'

@Entity('solicitud_refuerzo')
export class SolicitudRefuerzo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { nullable: true, default: 'pendiente' })
  estado: string

  @Column('date', { nullable: false })
  fecha: Date

  @ManyToOne(
    () => Terminal,
    (terminal) => terminal.id,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  terminal: Terminal

  @OneToMany(
    () => Vehiculo,
    (vehiculo) => vehiculo.solicitud_refuerzo,
    { eager: true, onDelete: 'SET NULL' },
  )
  vehiculos: Relation<Vehiculo>[]
}
