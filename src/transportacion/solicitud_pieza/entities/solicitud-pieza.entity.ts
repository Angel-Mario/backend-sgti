import { Chofer } from 'src/personal/chofer/entities/chofer.entity'
import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

export class SolicitudPieza {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { nullable: false })
  tipo: string

  @Column('numeric', { nullable: false })
  cantidad: number

  @Column('text', { nullable: true, default: 'pendiente' })
  estado: string

  @OneToOne(
    () => Chofer,
    (chofer) => chofer.id,
  )
  @JoinColumn()
  chofer: Chofer
}
