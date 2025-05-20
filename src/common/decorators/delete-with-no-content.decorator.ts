import { Delete, HttpCode, HttpStatus, applyDecorators } from '@nestjs/common'

export const DeleteWithNoContent = (path?: string | string[]) =>
  applyDecorators(Delete(path), HttpCode(HttpStatus.NO_CONTENT))
