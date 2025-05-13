import { PuntoRefService } from 'src/geografico/punto-ref/punto-ref.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Terminal } from './entities/terminal.entity'
import { In, Repository } from 'typeorm'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { CreateTerminalDto } from './dto/create-terminal.dto'
import { UpdateTerminalDto } from './dto/update-terminal.dto'

@Injectable()
export class TerminalService {
  constructor(
    @InjectRepository(Terminal)
    private readonly terminalRepository: Repository<Terminal>,
    private readonly puntoRefService: PuntoRefService,
  ) {}
  async findSimplex() {
    const nombres = await this.terminalRepository.find({
      select: {
        nombre: true,
        puntoRef: false,
        id: false,
      },
    })
    return nombres.map((terminal) => terminal.nombre)
  }
  async findAll() {
    const terminals = await this.terminalRepository.find()
    return terminals
  }
  async findOne(id: number) {
    const terminal = await this.terminalRepository.findOneBy({ id })
    if (!terminal) throw new Error('Terminal no encontrada')
    return terminal
  }
  async create(createTerminalDto: CreateTerminalDto) {
    try {
      const puntoRef = await this.puntoRefService.findOneByName(
        createTerminalDto.nombre,
      )
      const terminal = this.terminalRepository.create({
        nombre: createTerminalDto.nombre,
        puntoRef: puntoRef,
      })
      await this.terminalRepository.save(terminal)
    } catch (error) {
      handleDBErrors(error)
    }
    return 'Terminal creada correctamente'
  }
  async update(id: number, updateTerminalDto: UpdateTerminalDto) {
    const terminal = await this.findOne(id)
    const puntoRef = await this.puntoRefService.findOneByName(
      updateTerminalDto.nombre,
    )
    terminal.nombre = updateTerminalDto.nombre
    terminal.puntoRef = puntoRef
    try {
      return await this.terminalRepository.save(terminal)
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async removeMany(ids: string[]) {
    const deleteResult = await this.terminalRepository.delete({ id: In(ids) })
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        'No se encontraron terminales con los ids proporcionados',
      )
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se pudieron eliminar todas las terminales seleccionadas',
      )
    }
  }
}
