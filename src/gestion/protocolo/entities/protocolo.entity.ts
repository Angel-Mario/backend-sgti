import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('protocolo')
export class Protocolo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { nullable: false, unique: true })
  nombre: string

  @Column('text', { nullable: false })
  descripcion: string

  @Column('text', { nullable: false })
  medidas: string
}
