import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('puntoref')
export class PuntoRef {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text', { unique: true, nullable: false })
  nombre: string

  @Column('text', { unique: true, nullable: false })
  latLong: string
}
