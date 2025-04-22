import { User } from 'src/auth/entities/user.entity'
import { Ruta } from 'src/geografico/ruta/entities/ruta.entity'
import { Omnibus } from 'src/transportacion/omnibus/entities/omnibus.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('chofer')
export class Chofer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { nullable: true })
  residencia: string

  @OneToOne(
    () => User,
    (user) => user.id,
    {
      onDelete: 'CASCADE',
      cascade: true,
      eager: true,
    },
  )
  @JoinColumn()
  user: User

  @OneToOne(
    () => Omnibus,
    (omnibus) => omnibus.id,
    { eager: true },
  )
  @JoinColumn()
  omnibus?: Omnibus

  @ManyToOne(() => Ruta, { eager: true })
  @JoinColumn()
  ruta?: Ruta
}
