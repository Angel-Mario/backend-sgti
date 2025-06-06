import { Terminal } from 'src/geografico/terminal/entities/terminal.entity'
import { Vehiculo } from 'src/transportacion/vehiculo/entities/vehiculo.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('solicitud_refuerzo')
export class SolicitudRefuerzo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { nullable: true, default: 'pendiente' })
  estado: string

  @ManyToOne(
    () => Terminal,
    (terminal) => terminal.id,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  terminal: Terminal

  @OneToOne(
    () => Vehiculo,
    (vehiculo) => vehiculo.id,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  vehiculo: Vehiculo
}
