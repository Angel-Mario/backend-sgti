import { PuntoRef } from 'src/geografico/punto-ref/entities/punto-ref.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('punto_comb')
export class PuntoCombustible {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text', { unique: true, nullable: false })
  nombre: string

  @ManyToOne(() => PuntoRef, { eager: true })
  @JoinColumn({ name: 'punto_ref_id' })
  puntoRef: PuntoRef
}
