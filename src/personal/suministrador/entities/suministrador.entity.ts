import { User } from 'src/auth/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('suministrador')
export class Suministrador {
  @PrimaryGeneratedColumn('uuid')
  id: string

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

  @Column('text', { unique: true, nullable: true })
  cargo: string
}
