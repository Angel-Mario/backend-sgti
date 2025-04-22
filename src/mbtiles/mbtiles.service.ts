import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common'
import * as sqlite3 from 'sqlite3'

interface TileRow {
  tile_data: Buffer
}

interface MetadataRow {
  name: string
  value: string
}

@Injectable()
export class MbtilesService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private readonly logger = new Logger(MbtilesService.name)
  private db: sqlite3.Database

  async openDatabase(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(
        filePath,
        sqlite3.OPEN_READONLY,
        (err: Error | null) => {
          if (err) {
            this.logger.error(
              `Failed to open database at ${filePath}`,
              err.message,
            )
            return reject(err)
          }
          this.logger.log(`Successfully opened MBTiles database at ${filePath}`)
          resolve()
        },
      )
    })
  }

  async getTile(z: number, x: number, y: number): Promise<unknown> {
    const cacheKey = `tile_${z}_${x}_${y}`
    // Try to get from cache first
    const cachedTile = await this.cacheManager.get<Buffer>(cacheKey)
    if (cachedTile) {
      return cachedTile
    }

    // If not in cache, fetch from database
    const tile = await new Promise((resolve, reject) => {
      const tmsY = (1 << z) - 1 - y // Convert XYZ to TMS

      this.db.get(
        'SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?',
        [z, x, tmsY],
        (err: Error | null, row: TileRow) => {
          if (err) {
            this.logger.error(
              `Error fetching tile z:${z}, x:${x}, y:${y}`,
              err.message,
            )
            return reject(err)
          }
          if (!row?.tile_data) {
            return resolve(null)
          }
          resolve(row.tile_data)
        },
      )
    })
    let processedTile = tile

    const sharp = require('sharp')
    if (!tile) {
      try {
        processedTile = await sharp({
          create: {
            width: 1,
            height: 1,
            channels: 3,
            background: { r: 255, g: 255, b: 255 },
          },
        })
          .webp()
          .toBuffer()
      } catch (err) {
        this.logger.error(`Error processing tile z:${z}, x:${x}, y:${y}`, err)
        processedTile = tile // Fallback to original
      }
    }
    // Process image if resize options provided
    else {
      try {
        const sharp = require('sharp')
        processedTile = await sharp(tile)
          .webp({ lossless: true, quality: 20 })
          .toBuffer()
      } catch (err) {
        this.logger.error(`Error processing tile z:${z}, x:${x}, y:${y}`, err)
        processedTile = tile // Fallback to original
      }
    }

    if (processedTile) {
      // Cache the tile if found
      await this.cacheManager.set(cacheKey, processedTile, 86400) // 24 hours TTL
    }
    return processedTile
  }

  async getMetadata() {
    const cacheKey = 'metadata'

    // Try to get from cache first
    const cachedMetadata =
      await this.cacheManager.get<Record<string, string>>(cacheKey)
    if (cachedMetadata) {
      return cachedMetadata
    }

    // If not in cache, fetch from database
    const metadata = await new Promise((resolve, reject) => {
      this.db.all(
        'SELECT name, value FROM metadata',
        (err: Error | null, rows: MetadataRow[]) => {
          if (err) {
            this.logger.error('Error fetching metadata', err.message)
            return reject(err)
          }

          const metadata: Record<string, string> = {}
          for (const row of rows) {
            metadata[row.name] = row.value
          }
          resolve(metadata)
        },
      )
    })
    // Cache the metadata
    await this.cacheManager.set(cacheKey, metadata, 86400) // 24 hours TTL

    return metadata
  }
}
