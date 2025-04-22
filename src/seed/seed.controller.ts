import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { SeedService } from './seed.service';

@Controller()
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('seed')
  // @Auth(ValidRoles.superUser)
  seed() {
    return this.seedService.rundSeed();
  }
}
