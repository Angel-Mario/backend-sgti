import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SolicitudRefuerzo } from './entities/SolicitudRefuerzo.entity'
import { Repository } from 'typeorm'
import { VehiculoService } from 'src/transportacion/vehiculo/vehiculo.service'
import { ChoferService } from 'src/personal/chofer/chofer.service'
import { TerminalService } from 'src/geografico/terminal/terminal.service'
import { CreateSolicitudRefuerzoDto } from './dtos/create-solicitud-refuerzo.dto'
import handleDBErrors from 'src/common/handlers/handleDBErrors'

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
}
