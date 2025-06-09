import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Protocolo } from '../../protocolo/entities/protocolo.entity'

@Entity('operacion')
export class Operacion {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('date', { nullable: false, unique: true })
  fecha: Date

  @ManyToOne(
    () => Protocolo,
    (protocolo) => protocolo.id,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  protocolo: Protocolo
}
