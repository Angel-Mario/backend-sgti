import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Protocolo } from './entities/protocolo.entity'
import { In, Repository } from 'typeorm'
import { CreateProtocoloDto } from './dtos/create-protocolo.dto'
import { UpdateProtocoloDto } from './dtos/update-protocolo.dto'
import handleDBErrors from 'src/common/handlers/handleDBErrors'

@Injectable()
export class ProtocoloService {
  constructor(
    @InjectRepository(Protocolo)
    private readonly protocoloRepository: Repository<Protocolo>,
  ) {}

  async findOne(id: string) {
    const protocolo = this.protocoloRepository.findOneBy({ id })

    if (!protocolo) throw new NotFoundException('Protocolo no encontrado')

    return protocolo
  }
  async getSimplexProtocolo() {
    const procolos = await this.protocoloRepository.find()

    return procolos.map((protocolo) => protocolo.nombre)
  }
  async findByNombre(nombre: string) {
    const protocolo = await this.protocoloRepository.findOneBy({ nombre })

    if (!protocolo) throw new NotFoundException('Protocolo no encontrado')

    return protocolo
  }

  async removeMany(ids: string[]) {
    const deleteResult = await this.protocoloRepository.delete({ id: In(ids) })
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        'No se encontraron protocolos con los ids proporcionados',
      )
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se pudieron eliminar todos los protocolos seleccionados',
      )
    }
    return 'Protocolos eliminados correctamente'
  }
  create(createProtocoloDto: CreateProtocoloDto) {
    try {
      const protocolo = this.protocoloRepository.create(createProtocoloDto)
      this.protocoloRepository.save(protocolo)
    } catch (error) {
      handleDBErrors(error)
    }
    return 'Protocolo creado correctamente'
  }
  async update(id: string, updateProtocoloDto: UpdateProtocoloDto) {
    const protocolo = await this.findOne(id)

    Object.assign(protocolo, updateProtocoloDto)

    try {
      await this.protocoloRepository.save(protocolo)
    } catch (error) {
      handleDBErrors(error)
    }
    return 'Protocolo actualizado correctamente'
  }
}
