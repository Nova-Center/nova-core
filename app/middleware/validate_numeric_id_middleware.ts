import type { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class ValidateNumericIdMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const params = ctx.request.params()

    const isInvalid = Object.values(params).some((value) => Number.isNaN(+value))

    if (isInvalid) {
      return ctx.response.badRequest({ message: 'Invalid ID format' })
    }

    await next()
  }
}
