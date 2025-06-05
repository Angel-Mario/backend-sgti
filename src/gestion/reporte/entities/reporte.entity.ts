import { Admin } from 'src/personal/administrador/entities/administrador.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('reporte')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('date')
  fecha: Date

  @Column('text')
  asunto: string

  @Column('text')
  texto: string

  @ManyToOne(
    () => Admin,
    (admin) => admin.id,
    { eager: false },
  )
  @JoinColumn()
  administrador: Admin
}
