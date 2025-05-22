import type { HttpContext } from '@adonisjs/core/http'
import { UserRole, rolesHierarchy } from '../types/user_role.enum.js'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>, role: UserRole) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    if (user.role === role) {
      return next()
    }

    const subRoles = rolesHierarchy[user.role]

    if (!subRoles.includes(role)) {
      return response.forbidden({ message: 'Forbidden' })
    }

    await next()
  }
}
