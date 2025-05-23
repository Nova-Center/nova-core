import { HttpContext } from '@adonisjs/core/http'
import { NovaPointService } from '#services/nova_point_service'
import { UserRole } from '../types/user_role.enum.js'
import { addNovaPointsUser } from '#validators/add_nova_points_user'
import { removeNovaPointsUser } from '#validators/remove_nova_points_user'

export default class NovaPointsController {
  /**
   * @history
   * @summary Get user's point history
   * @description Get the history of points for a user
   * @responseBody 200 - <NovaPoint[]>
   */
  async history({ auth, response }: HttpContext) {
    const user = auth.user!
    const history = await NovaPointService.getUserPointHistory(user.id)
    return response.ok(history)
  }

  /**
   * @total
   * @summary Get user's total points
   * @description Get the total points for a user
   * @responseBody 200 - <{ totalPoints: number }>
   */
  async total({ auth, response }: HttpContext) {
    const user = auth.user!
    const novaPoints = await NovaPointService.getUserTotalPoints(user.id)
    return response.ok({ novaPoints })
  }

  /**
   * @leaderboard
   * @summary Get points leaderboard
   * @description Get the leaderboard of points
   * @responseBody 200 - <NovaPoint[]>.only(id, points).append("username": "sagby")
   */
  async leaderboard({ response }: HttpContext) {
    const leaderboard = await NovaPointService.getLeaderboard()
    return response.ok(leaderboard)
  }

  /**
   * @addPoints
   * @summary Add points to a user
   * @description Add points to a user
   * @requestBody <addNovaPointsUser>
   * @responseBody 201 - <NovaPoint>
   */
  async addPoints({ request, response, auth, params }: HttpContext) {
    const { id } = params
    const user = auth.user!
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      return response.forbidden({ message: 'Only admins can add points' })
    }

    const { action, description, points } = await addNovaPointsUser.validate(request.body())

    if (points) {
      const novaPoint = await NovaPointService.addSpecificPoints(id, points, action, description)
      return response.created(novaPoint)
    }

    try {
      const novaPoint = await NovaPointService.addPoints(id, action, description)
      return response.created(novaPoint)
    } catch (error) {
      return response.badRequest({ message: error.message || 'Failed to add points' })
    }
  }

  /**
   * @remove
   * @summary Remove points from a user
   * @description Remove points from a user
   * @requestBody <removeNovaPointsUser>
   * @responseBody 200 - { "novaPoints": 565 }
   */
  async remove({ request, response, auth, params }: HttpContext) {
    const { id } = params
    const user = auth.user!
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      return response.forbidden({ message: 'Only admins can delete points' })
    }

    const { points } = await removeNovaPointsUser.validate(request.body())

    if (!points) {
      return response.badRequest({ message: 'Points are required' })
    }

    const novaPoints = await NovaPointService.deletePoints(id, points)

    return response.ok({ novaPoints })
  }
}
