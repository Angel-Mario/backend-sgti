import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('combustible_asignado')
export class CombustibleAsignado {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('integer', { default: 0 })
  cantidadL: number

  @Column('date', { nullable: false, unique: true })
  fecha: Date
}
