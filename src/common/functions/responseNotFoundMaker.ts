import { NotFoundException } from '@nestjs/common'

export default (
  length: number,
  sust: string,
  plural: string,
  sust2: string,
): never => {
  if (length > 1) {
    throw new NotFoundException(
      `No se encontraron ${sust + plural} con los ${sust2}s proporcionados`,
    )
  }
  throw new NotFoundException(
    `No se encontró ningún ${sust} con el ${sust2} proporcionado`,
  )
}
