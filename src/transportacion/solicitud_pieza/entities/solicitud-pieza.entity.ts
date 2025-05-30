import { Chofer } from 'src/personal/chofer/entities/chofer.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('solicitud_pieza')
export class SolicitudPieza {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { nullable: false })
  tipo: string

  @Column('integer', { nullable: false })
  cantidad: number

  @Column('text', { nullable: true, default: 'pendiente' })
  estado: string

  @ManyToOne(
    () => Chofer,
    (chofer) => chofer.id,
  )
  @JoinColumn()
  chofer: Chofer
}
