import { PuntoCombustibleService } from './../../geografico/punto-comb/punto-comb.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CombustibleChofer } from './entities/combustible-chofer.entity'
import { In, Repository } from 'typeorm'
import { ChoferService } from 'src/personal/chofer/chofer.service'
import { PaginationCombustibleChoferDto } from './dtos/pagination-combustible-chofer.dto'
import { CreateCombustibleChoferDto } from './dtos/create-combustible-chofer.dto'
import { UpdateCombustibleChoferDto } from './dtos/update-combustible-chofer.dto'
import handleDBErrors from 'src/common/handlers/handleDBErrors'
import { PuntoRef } from 'src/geografico/punto-ref/entities/punto-ref.entity'

@Injectable()
export class CombustibleChoferService {
  constructor(
    @InjectRepository(CombustibleChofer)
    private readonly combustibleChoferRepository: Repository<CombustibleChofer>,
    private readonly choferService: ChoferService,
    private readonly puntoCombustibleService: PuntoCombustibleService,
  ) {}

  async loadFormData() {
    const nombres_puntos = await this.puntoCombustibleService.findSimplex()
    const nombres_choferes =
      await this.choferService.findUsersWithoutCombustible()
    return { nombres_puntos, nombres_choferes }
  }

  async findOne(id: string) {
    const combustibleChofer = await this.combustibleChoferRepository.findOneBy({
      id,
    })
    if (!combustibleChofer)
      throw new NotFoundException('Asignación de combustible no encontrada')
    return combustibleChofer
  }

  async update(
    id: string,
    updateCombustibleChoferDto: UpdateCombustibleChoferDto,
  ) {
    const combustibleChofer = await this.findOne(id)
    let puntoCombustible = undefined

    if (
      combustibleChofer.punto_combustible.nombre !==
      updateCombustibleChoferDto.puntoComb
    ) {
      puntoCombustible = await this.puntoCombustibleService.findOneByName(
        updateCombustibleChoferDto.puntoComb,
      )
    }

    try {
      if (puntoCombustible) {
        Object.assign(combustibleChofer, {
          litros: updateCombustibleChoferDto.litros,
          punto_combustible: puntoCombustible,
        })
      } else {
        Object.assign(combustibleChofer, {
          litros: updateCombustibleChoferDto.litros,
        })
      }
    } catch (error) {
      handleDBErrors(error)
    }
    await this.combustibleChoferRepository.save(combustibleChofer)
    return 'Asignación de combustible actualizada correctamente'
  }
  async create(createCombustibleChoferDto: CreateCombustibleChoferDto) {
    const chofer = await this.choferService.findOneByUserName(
      createCombustibleChoferDto.chofer,
    )
    const puntoCombustible = await this.puntoCombustibleService.findOneByName(
      createCombustibleChoferDto.puntoComb,
    )
    try {
      const combustibleChofer = this.combustibleChoferRepository.create({
        litros: createCombustibleChoferDto.litros,
        chofer: chofer,
        punto_combustible: puntoCombustible,
      })
      console.log(combustibleChofer)
      await this.combustibleChoferRepository.save(combustibleChofer)
    } catch (error) {
      handleDBErrors(error)
    }

    return 'Asignación de combustible creada correctamente'
  }
  async findAll(paginationDto: PaginationCombustibleChoferDto) {
    const {
      page = 1,
      pageSize = +process.env.DEFAULT_PAGE_SIZE,
      order = process.env.DEFAULT_ORDER,
      sorting = 'id',
      search = '',
      column = '',
    } = paginationDto

    const query = this.combustibleChoferRepository
      .createQueryBuilder('combustible_chofer')
      .leftJoin('combustible_chofer.chofer', 'chofer')
      .addSelect('chofer.id')
      .leftJoin('chofer.user', 'user')
      .addSelect('user.fullName')
      .addSelect('user.carnet')
      .leftJoinAndSelect(
        'combustible_chofer.punto_combustible',
        'punto_combustible',
      )
      .leftJoinAndSelect('chofer.vehiculo', 'vehiculo')
      .leftJoin('punto_combustible.puntoRef', 'puntoRef')
      .addSelect('puntoRef.latLong')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(
        sorting === 'vehiculo'
          ? 'vehiculo.consumo'
          : sorting === 'chofer'
            ? 'user.fullName'
            : sorting === 'punto_combustible'
              ? 'punto_combustible.nombre'
              : `combustible_chofer.${sorting}`,
        `${order.toLocaleLowerCase() === 'asc' ? 'ASC' : 'DESC'}`,
      )
    if (search !== '' && column !== '') {
      query.where(
        column === 'vehiculo'
          ? 'CAST(vehiculo.matricula AS TEXT) ILIKE(:search)'
          : column === 'chofer'
            ? 'CAST(user.fullName AS TEXT) ILIKE(:search)'
            : column === 'punto_combustible'
              ? 'CAST(punto_combustible.nombre AS TEXT) ILIKE(:search)'
              : `CAST(combustible_chofer.${column} AS TEXT) ILIKE(:search)`,
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
  async removeMany(ids: string[]) {
    const deleteResult = await this.combustibleChoferRepository.delete({
      id: In(ids),
    })
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        'No se encontraron las asignaciones de combustibles con los ids proporcionados',
      )
    }
    if (deleteResult.affected !== ids.length) {
      throw new NotFoundException(
        'No se pudieron eliminar todas las asignaciones de combustibles seleccionadas',
      )
    }
    return 'Asignación de combustible eliminada correctamente'
  }
}
