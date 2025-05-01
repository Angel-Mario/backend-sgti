import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('vehiculo')
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { nullable: false, unique: true })
  matricula: string

  @Column('numeric')
  consumo: number

  @Column('numeric')
  capacidad: number

  @Column('text', { nullable: true })
  marca: string

  @Column('text', { nullable: true })
  modelo: string

  @Column('numeric', { nullable: true })
  año: number
}
