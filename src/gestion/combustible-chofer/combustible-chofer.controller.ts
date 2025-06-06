import { Controller } from '@nestjs/common'
import { CombustibleChoferService } from './combustible-chofer.service'

@Controller('gestion/combustible-chofer')
export class CombustibleChoferController {
  constructor(
    private readonly combustibleChoferService: CombustibleChoferService,
  ) {}
}
