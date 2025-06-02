import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

export default (error): never => {
  if (error.code == 23505) throw new BadRequestException(error.detail)
  else if (error.status === 404)
    throw new NotFoundException(error.response.message)
  else {
    console.log(error.code, 'Codigo')
    console.log(error)
    throw new InternalServerErrorException('Check logs')
  }
}
