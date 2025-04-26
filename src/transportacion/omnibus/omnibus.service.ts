import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isUUID } from 'class-validator'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { Chofer } from 'src/personal/chofer/entities/chofer.entity'
import { In, Repository } from 'typeorm'
import { CreateOmnibusDto } from './dtos/create-omnibus.dto'
import { PaginationOmnibusDto } from './dtos/pagination-omnibus.dto'
import { UpdateOmnibusDto } from './dtos/update-omnibus.dto'
import { Omnibus } from './entities/omnibus.entity'

@Injectable()
export class OmnibusService {
  constructor(
    @InjectRepository(Omnibus)
    private readonly omnibusRepository: Repository<Omnibus>,
  ) {}

  async findAll(paginationDto: PaginationOmnibusDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'chapa',
      search = '',
      column = '',
    } = paginationDto

    const query = this.omnibusRepository
      .createQueryBuilder('omnibus')
      .leftJoinAndMapOne(
        'omnibus.chofer', // Nueva propiedad en el objeto Omnibus
        Chofer, // La entidad que queremos unir (Chofer)
        'chofer', // Alias para la entidad Chofer en la consulta
        'chofer.omnibusId = omnibus.id', // Condición de join
      )
      .select(['omnibus', 'chofer.id'])
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(
        `omnibus.${sorting}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (search !== '' && column !== '') {
      query.where(`CAST(omnibus.${column} AS TEXT) LIKE(:search)`, {
        search: `%${search}%`,
      })
    }
    const data = await query.getManyAndCount()

    return {
      data: data[0],
      count: data[1],
      pages: Math.ceil(data[1] / pageSize),
    }
  }

  async findAllSimplex() {
    const omnibuses = await this.omnibusRepository.find({
      select: {
        id: false,
        chapa: true,
        marca: false,
        modelo: false,
        capacidad: false,
        año: false,
        consumo: false,
      },
    })
    return omnibuses.map((obj) => obj.chapa)
  }

  async update(id: string, updateOmnibusDto: UpdateOmnibusDto) {
    const omnibus = await this.omnibusRepository.findOneBy({ id })

    try {
      Object.assign(omnibus, updateOmnibusDto)
      return await this.omnibusRepository.save(omnibus)
    } catch (error) {
      handleDBErrors(error)
    }
  }
  async create(createOmnibusDto: CreateOmnibusDto) {
    try {
      const omnibus = this.omnibusRepository.create(createOmnibusDto)
      await this.omnibusRepository.save(omnibus)
    } catch (error) {
      handleDBErrors(error)
    }
    return 'Ómnibus creado correctamente'
  }
  async findOne(id: string) {
    let omnibus: undefined | Omnibus = undefined
    if (isUUID(id, '4')) {
      omnibus = await this.omnibusRepository.findOneBy({ id })
    } else {
      omnibus = await this.omnibusRepository.findOneBy({ chapa: id })
    }
    if (!omnibus) throw new NotFoundException('Ómnibus no encontrado')
    return omnibus
  }
  async removeMany(ids: string[]) {
    const deleteResult = await this.omnibusRepository.delete({ id: In(ids) })
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        'No se encontraron ómnibuses con los ids proporcionados',
      )
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se pudieron eliminar todos los ómnibuses seleccionados',
      )
    }
  }
}
