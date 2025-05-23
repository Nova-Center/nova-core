import type { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class ValidateNumericIdMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { id } = ctx.request.params()

    if (Number.isNaN(+id)) {
      return ctx.response.badRequest({ message: 'Invalid ID format' })
    }

    await next()
  }
}
