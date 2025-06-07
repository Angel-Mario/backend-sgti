import { SolicitudRefuerzo } from 'src/gestion/solicitud-refuerzo/entities/solicitud-refuerzo.entity'
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'

@Entity('vehiculo')
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { nullable: false, unique: true })
  matricula: string

  @Column('float', { nullable: true })
  consumo: number

  @Column('integer', { nullable: true })
  capacidad: number

  @Column('text', { nullable: false })
  marca: string

  @Column('text', { nullable: true })
  modelo: string

  @Column('integer', { nullable: true })
  año: number

  @ManyToOne(
    () => SolicitudRefuerzo,
    (solicitudRefuerzo) => solicitudRefuerzo.vehiculos,
    { eager: false, onDelete: 'SET NULL' },
  )
  solicitud_refuerzo: Relation<SolicitudRefuerzo>
}
