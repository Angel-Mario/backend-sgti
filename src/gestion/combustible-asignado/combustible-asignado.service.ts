import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCombustibleAsignadoDto } from './dtos/create-combustible-asignado.dto'
import { UpdateCombustibleAsignadoDto } from './dtos/update-combustible-asignado.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CombustibleAsignado } from './entities/combustible-asignado.entity'
import { In, Repository } from 'typeorm'
import handleDBErrors from 'src/common/handlers/handleDBErrors'

@Injectable()
export class CombustibleAsignadoService {
  constructor(
    @InjectRepository(CombustibleAsignado)
    private readonly combustibleRepository: Repository<CombustibleAsignado>,
  ) {}
  findAll() {
    //Combustible desde el primer dia del mes hasta el 15 del mes siguiente
    const today = new Date()
    const nextMonth = today.getMonth() + 1 // Move to the next month
    const nextMonth15th = new Date(today.getFullYear(), nextMonth, 15)

    const combustibleMensual = this.combustibleRepository
      .createQueryBuilder('combustible')
      .where('combustible.fecha between :fechaInicio and :fechaFin', {
        fechaInicio: new Date(today.getFullYear(), today.getMonth(), 1),
        fechaFin: nextMonth15th,
      })
      .getMany()
    return combustibleMensual
  }

  findOne(id: string) {
    const combustible = this.combustibleRepository.findOneBy({ id })
    if (!combustible)
      throw new NotFoundException('Asignación de combustible no encontrada')
    return combustible
  }
  findOneByDate(fecha: Date) {
    const combustible = this.combustibleRepository.findOne({
      where: { fecha },
    })
    if (!combustible)
      throw new NotFoundException('Asignación de combustible no encontrada')
    return combustible
  }

  async update(
    id: string,
    updateCombustibleAsignadoDto: UpdateCombustibleAsignadoDto,
  ) {
    const combustible = await this.findOne(id)
    try {
      Object.assign(combustible, updateCombustibleAsignadoDto)
    } catch (error) {
      handleDBErrors(error)
    }
    await this.combustibleRepository.save(combustible)
    return 'Asignación de combustible actualizada correctamente'
  }
  async removeMany(ids: string[]) {
    const deleteResult = await this.combustibleRepository.delete({
      id: In(ids),
    })
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        'No se encontraron combustibles con los ids proporcionados',
      )
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se pudieron eliminar todos los combustibles seleccionados',
      )
    }
    return 'Asignación de combustible eliminado correctamente'
  }
  thisMonthFuel() {
    const today = new Date()

    const combustibleMensual = this.combustibleRepository
      .createQueryBuilder('combustible')
      .select('SUM(combustible.cantidadL)', 'combustible')
      .where('combustible.fecha between :fechaInicio and :fechaFin', {
        fechaInicio: new Date(today.getFullYear(), today.getMonth(), 1),
        fechaFin: new Date(today.getFullYear(), today.getMonth(), 31),
      })
      .getRawOne()
    return combustibleMensual
  }
  async create(createCombustibleAsignadoDto: CreateCombustibleAsignadoDto) {
    try {
      const combustible = this.combustibleRepository.create({
        ...createCombustibleAsignadoDto,
        fecha: new Date(
          createCombustibleAsignadoDto.fecha.getFullYear(),
          createCombustibleAsignadoDto.fecha.getMonth(),
          createCombustibleAsignadoDto.fecha.getDate(),
        ),
      })
      await this.combustibleRepository.save(combustible)
    } catch (error) {
      handleDBErrors(error)
    }
    return 'Asignación de combustible creada correctamente'
  }
  async loadCombustibleAsignadoPage() {
    const today = new Date()
    //Combustible desde el primer dia del mes hasta el dia actual
    const combustibleToday = await this.combustibleRepository
      .createQueryBuilder('combustible')
      .select('SUM(combustible.cantidadL)', 'combustible')
      .where('combustible.fecha between :fechaInicio and :fechaFin', {
        fechaInicio: new Date(today.getFullYear(), today.getMonth(), 1),
        fechaFin: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDay(),
          23,
          59,
          59,
        ),
      })
      .getRawOne()
    return {
      combustibleToday: Number(combustibleToday.combustible),
      combustibleMensual: Number((await this.thisMonthFuel()).combustible),
    }
  }
}
