import { User } from 'src/auth/entities/user.entity'
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('admin')
export class Admin {
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
}
