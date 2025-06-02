import { Chofer } from 'src/personal/chofer/entities/chofer.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('solicitud_apoyo')
export class SolicitudApoyo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('date')
  fecha: Date

  @Column('text')
  descripcion: string

  @Column('text', { nullable: false })
  latLong: string

  @OneToOne(
    () => Chofer,
    (chofer) => chofer.id,
    { eager: true },
  )
  @JoinColumn()
  chofer: Chofer
}
