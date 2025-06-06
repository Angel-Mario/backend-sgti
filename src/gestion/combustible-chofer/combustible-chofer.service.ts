import { PuntoCombustibleService } from './../../geografico/punto-comb/punto-comb.service'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CombustibleChofer } from './entities/combustible-chofer.entity'
import { Repository } from 'typeorm'
import { ChoferService } from 'src/personal/chofer/chofer.service'

@Injectable()
export class CombustibleChoferService {
  constructor(
    @InjectRepository(CombustibleChofer)
    private readonly combustibleChoferRepository: Repository<CombustibleChofer>,
    private readonly choferService: ChoferService,
    private readonly puntoCombustibleService: PuntoCombustibleService,
  ) {}
}
