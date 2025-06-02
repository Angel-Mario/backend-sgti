import { Admin } from 'src/personal/administrador/entities/administrador.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('combustible_asignado')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('integer')
  cantidad: number

  @Column('date')
  fecha: Date

  @OneToOne(
    () => Admin,
    (admin) => admin.id,
    { eager: true },
  )
  @JoinColumn()
  administrador: Admin
}
