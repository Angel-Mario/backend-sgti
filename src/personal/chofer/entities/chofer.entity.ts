import { User } from 'src/auth/entities/user.entity'
import { Ruta } from 'src/geografico/ruta/entities/ruta.entity'
import { Vehiculo } from 'src/transportacion/vehiculo/entities/vehiculo.entity'
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
    () => Vehiculo,
    (vehiculo) => vehiculo.id,
    { eager: true },
  )
  @JoinColumn()
  vehiculo?: Vehiculo

  @ManyToOne(() => Ruta, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn()
  ruta?: Ruta
}
