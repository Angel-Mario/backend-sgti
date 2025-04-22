import * as path from 'node:path'
import { CacheModule } from '@nestjs/cache-manager'
import { MbtilesController } from './mbtiles.controller'
import { MbtilesService } from './mbtiles.service'

import { Module } from '@nestjs/common'

@Module({
  imports: [CacheModule.register()],
  controllers: [MbtilesController],
  providers: [MbtilesService],
})
export class MbtilesModule {
  constructor(private readonly mbtilesService: MbtilesService) {}

  async onModuleInit() {
    // Path to your MBTiles file
    const mbtilesPath = path.resolve(
      __dirname,
      '../',
      '../',
      'maps/OUTPUT_FILE.mbtiles',
    )
    console.log(mbtilesPath)

    try {
      await this.mbtilesService.openDatabase(mbtilesPath)
      console.log('MBTiles database initialized')
    } catch (err) {
      console.error('Failed to initialize MBTiles database:', err)
    }
  }
}
