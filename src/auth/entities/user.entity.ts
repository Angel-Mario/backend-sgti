import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('int8', { unique: true, nullable: false })
  carnet: number

  @Column('text', { unique: true })
  correo: string

  @Column('text', { nullable: false })
  fullName: string

  @Column('text', { unique: true })
  nombre_u: string

  @Column('text', { nullable: false, select: false })
  password: string

  @Column('text', { nullable: true })
  telefono: string

  //System attributes
  @Column('bool', { default: true })
  isActive: boolean

  @Column('text', { array: true, default: ['chofer'] })
  roles: string[]

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.nombre_u = this.nombre_u.trim()
  }
}
