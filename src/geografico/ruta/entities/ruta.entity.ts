import { PuntoRef } from 'src/geografico/punto-ref/entities/punto-ref.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('ruta')
export class Ruta {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { unique: true, nullable: false })
  nombre: string

  @Column('numeric', { default: 0 })
  distancia: number

  @Column('text', { nullable: false })
  hora_salida: string

  @Column('text', { nullable: false })
  hora_regreso: string

  @ManyToOne(() => PuntoRef, { eager: true })
  @JoinColumn({ name: 'punto_salida_id' })
  puntoSalida: PuntoRef

  @ManyToOne(() => PuntoRef, { eager: true })
  @JoinColumn({ name: 'punto_regreso_id' })
  puntoRegreso: PuntoRef
}
