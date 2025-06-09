import { Controller, Get, Header, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { MbtilesService } from './mbtiles.service'
import { AuthAllRoles } from 'src/common/decorators/auth-all-roles.decorator'

@Controller('tiles')
export class MbtilesController {
  constructor(private readonly mbtilesService: MbtilesService) {}

  @AuthAllRoles()
  @Get('/metadata')
  async getMetadata() {
    return this.mbtilesService.getMetadata()
  }

  @AuthAllRoles()
  @Get('/:z/:x/:y')
  @Header('Content-Type', 'image/png')
  @Header('Cache-Control', 'public, max-age=86400') // 24 hours
  async getRasterTile(
    @Param('z') z: number,
    @Param('x') x: number,
    @Param('y') y: number,
    @Res() res: Response,
  ) {
    const tile = await this.mbtilesService.getTile(+z, +x, +y)
    if (!tile) {
      return res.status(404).send('Tile not found')
    }
    return res.send(tile)
  }
}
