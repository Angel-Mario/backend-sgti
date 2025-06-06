import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SolicitudRefuerzo } from './entities/solicitud-refuerzo.entity'
import { In, Repository } from 'typeorm'
import { VehiculoService } from 'src/transportacion/vehiculo/vehiculo.service'
import { ChoferService } from 'src/personal/chofer/chofer.service'
import { TerminalService } from 'src/geografico/terminal/terminal.service'
import { CreateSolicitudRefuerzoDto } from './dtos/create-solicitud-refuerzo.dto'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { PaginationSolicitudRefuerzoDto } from './dtos/pagination-solicitud-refuerzo.dto'

@Injectable()
export class SolicitudRefuerzoService {
  constructor(
    @InjectRepository(SolicitudRefuerzo)
    private readonly solicitudRefuerzoRepository: Repository<SolicitudRefuerzo>,
    private readonly vehiculoService: VehiculoService,
    private readonly choferService: ChoferService,
    private readonly terminalService: TerminalService,
  ) {}
  async solicitudRefuerzoLoadData() {
    const terminalesSinReinforcements = (
      await this.terminalService.findTerminalesWithoutReinforcements()
    ).map((terminal) => terminal.nombre)
    const vehiculosSinReinforcements = (
      await this.vehiculoService.findVehiculosWithoutReinforcements()
    ).map((vehiculo) => vehiculo.matricula)

    return { terminalesSinReinforcements, vehiculosSinReinforcements }
  }
  async findAll(paginationDto: PaginationSolicitudRefuerzoDto) {
    return await this.solicitudRefuerzoRepository.find()
  }

  async findOne(id: string) {
    const solicitudRefuerzo = await this.solicitudRefuerzoRepository.findOneBy({
      id,
    })
    if (!solicitudRefuerzo)
      throw new NotFoundException('Solicitud de refuerzo no encontrada')
    return solicitudRefuerzo
  }

  async create(createSolicitudRefuerzoDto: CreateSolicitudRefuerzoDto) {
    const terminal = await this.terminalService.findOneByName(
      createSolicitudRefuerzoDto.terminalNombre,
    )
    const busquedaVehiculos = await Promise.all(
      createSolicitudRefuerzoDto.vehiculosMatriculas.map(async (matricula) => {
        return await this.vehiculoService.findOne(matricula)
      }),
    )
    try {
      for (const vehiculo of busquedaVehiculos) {
        const solicitudRefuerzo = this.solicitudRefuerzoRepository.create({
          vehiculo,
          terminal,
          estado: 'pendiente',
        })
        this.solicitudRefuerzoRepository.save(solicitudRefuerzo)
      }
    } catch (error) {
      handleDBErrors(error)
    }

    return 'Solicitud de refuerzo creada correctamente'
  }
  async update(id, updateSolicitudRefuerzoDto: CreateSolicitudRefuerzoDto) {
    const solicitudRefuerzo = await this.findOne(id)
    try {
      Object.assign(solicitudRefuerzo, updateSolicitudRefuerzoDto)
    } catch (error) {
      handleDBErrors(error)
    }
    await this.solicitudRefuerzoRepository.save(solicitudRefuerzo)
    return 'Solicitud de refuerzo actualizada correctamente'
  }

  async removeMany(ids: string[]) {
    const deleteResult = await this.solicitudRefuerzoRepository.delete({
      id: In(ids),
    })
    if (deleteResult.affected === 0) {
      throw new NotFoundException('No se encontraron solicitudes de refuerzo')
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se encontraron todos los solicitudes de refuerzo',
      )
    }
  }
}
