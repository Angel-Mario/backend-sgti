import { SolicitudRefuerzo } from '../../gestion/solicitud-refuerzo/entities/solicitud-refuerzo.entity'
import { PuntoRefService } from 'src/geografico/punto-ref/punto-ref.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Terminal } from './entities/terminal.entity'
import { In, Repository } from 'typeorm'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { CreateTerminalDto } from './dto/create-terminal.dto'
import { UpdateTerminalDto } from './dto/update-terminal.dto'
import { PaginationTerminalDto } from './dto/pagination-terminal.dto'

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
  async findTerminalesWithoutReinforcements(): Promise<
    { id: number; nombre: string }[]
  > {
    const terminales = await this.terminalRepository
      .createQueryBuilder('terminal')
      .leftJoin(
        SolicitudRefuerzo,
        'solicitud_refuerzo',
        'solicitud_refuerzo.terminal = terminal.id',
      )
      .where('solicitud_refuerzo.id IS NULL')
      .getMany()
    return terminales
  }

  async findAll(paginationDto: PaginationTerminalDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'nombre',
      search = '',
      column = '',
    } = paginationDto

    const query = this.terminalRepository
      .createQueryBuilder('terminal')
      .leftJoinAndSelect('terminal.puntoRef', 'puntoRef')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(
        sorting === 'puntoRef' ? 'puntoRef.nombre' : `terminal.${sorting}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (search !== '' && column !== '') {
      query.where(
        column === 'puntoRef'
          ? 'CAST(puntoRef.nombre AS TEXT) ILIKE(:search)'
          : `CAST(terminal.${column} AS TEXT) ILIKE(:search)`,
        {
          search: `%${search}%`,
        },
      )
    }

    const data = await query.getManyAndCount()

    return {
      data: data[0],
      count: data[1],
      pages: Math.ceil(data[1] / pageSize),
    }
  }
  async findOne(id: number) {
    const terminal = await this.terminalRepository.findOneBy({ id })
    if (!terminal) throw new NotFoundException('Terminal no encontrada')
    return terminal
  }
  async findOneByName(nombre: string) {
    const terminal = await this.terminalRepository.findOneBy({ nombre })
    if (!terminal) throw new NotFoundException('Terminal no encontrado')
    return terminal
  }

  async create(createTerminalDto: CreateTerminalDto) {
    try {
      const puntoRef = await this.puntoRefService.findOneByName(
        createTerminalDto.puntoRef,
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
      updateTerminalDto.puntoRef,
    )
    terminal.nombre = updateTerminalDto.nombre
    terminal.puntoRef = puntoRef
    try {
      return await this.terminalRepository.save(terminal)
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async removeMany(ids: number[]) {
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
