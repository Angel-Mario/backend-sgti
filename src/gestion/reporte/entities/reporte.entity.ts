import { Admin } from 'src/personal/administrador/entities/administrador.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('reporte')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('date')
  fecha: Date

  @Column('text')
  descripcion: string

  @OneToOne(
    () => Admin,
    (admin) => admin.id,
    { eager: true },
  )
  @JoinColumn()
  administrador: Admin
}
