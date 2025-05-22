import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { UserRole } from '../types/user_role.enum.js'
import { banUserValidator } from '#validators/ban_user'

export default class BansController {
  /**
   * @ban
   * @summary Ban a user
   * @description Ban a user by their ID
   * @requestBody <banUserValidator>
   * @responseBody 200 - { "message": "User banned successfully" }
   * @responseBody 403 - Not authorized
   * @responseBody 404 - User not found
   */
  public async ban({ request, response, auth, logger }: HttpContext) {
    const user = auth.user!

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      logger.warn('Unauthorized ban attempt')
      return response.forbidden({ message: 'Not authorized to ban users' })
    }

    const { reason } = await request.validateUsing(banUserValidator)
    const { id: userId } = request.params()

    const userToBan = await User.find(userId)

    if (!userToBan) {
      logger.warn({ userId }, 'User not found for ban')
      return response.notFound({ message: 'User not found' })
    }

    if (
      (userToBan.role === UserRole.SUPERADMIN || userToBan.role === UserRole.ADMIN) &&
      user.role !== UserRole.SUPERADMIN
    ) {
      logger.warn('Attempt to ban superadmin by admin')
      return response.forbidden({ message: 'Only superadmin can ban another admin' })
    }

    userToBan.isBanned = true
    userToBan.banReason = reason
    await userToBan.save()

    logger.info({ userId, reason }, 'User banned successfully')
    return response.ok({ message: 'User banned successfully' })
  }

  /**
   * @unban
   * @summary Unban a user
   * @description Unban a user by their ID
   * @responseBody 200 - { "message": "User unbanned successfully" }
   * @responseBody 403 - Not authorized
   * @responseBody 404 - User not found
   */
  public async unban({ request, response, auth, logger }: HttpContext) {
    const user = auth.user!

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      logger.warn('Unauthorized unban attempt')
      return response.forbidden({ message: 'Not authorized to unban users' })
    }

    const { id: userId } = request.params()
    const userToUnban = await User.find(userId)

    if (!userToUnban) {
      logger.warn({ userId }, 'User not found for unban')
      return response.notFound({ message: 'User not found' })
    }

    userToUnban.isBanned = false
    userToUnban.banReason = null
    await userToUnban.save()

    logger.info({ userId }, 'User unbanned successfully')
    return response.ok({ message: 'User unbanned successfully' })
  }
}
