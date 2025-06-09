import { PuntoCombustible } from 'src/geografico/punto-comb/entities/punto-comb.entity'
import { Chofer } from 'src/personal/chofer/entities/chofer.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('combustible_chofer')
export class CombustibleChofer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('integer', { nullable: false })
  litros: number

  @ManyToOne(
    () => PuntoCombustible,
    (puntoCombustible) => puntoCombustible.id,
    { eager: true },
  )
  @JoinColumn()
  punto_combustible: PuntoCombustible

  @OneToOne(
    () => Chofer,
    (chofer) => chofer.id,
    { eager: true },
  )
  @JoinColumn()
  chofer: Chofer
}
