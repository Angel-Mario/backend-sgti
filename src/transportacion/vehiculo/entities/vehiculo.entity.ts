import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
}
