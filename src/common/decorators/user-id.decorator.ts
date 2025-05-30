// user.decorator.ts
import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const authHeader = request.headers?.authorization

    if (!authHeader) return null

    const token = authHeader.split(' ')[1]
    const decoded = jwt.decode(token) as { [key: string]: string }
    return decoded?.id // Return either 'id' or 'sub'
  },
)
