import NovaPoint from '#models/nova_point'
import User from '#models/user'

export class NovaPointService {
  // Points constants
  private static readonly POINTS = {
    CREATE_POST: 10,
    CREATE_COMMENT: 5,
    RECEIVE_LIKE: 2,
    RECEIVE_COMMENT: 3,
    DAILY_LOGIN: 1,
  }

  /**
   * Add points to a user
   */
  static async addPoints(userId: number, action: string, description: string): Promise<NovaPoint> {
    const points = this.getPointsForAction(action)
    if (points === 0) {
      throw new Error(`Invalid action: ${action}`)
    }

    const novaPoint = await NovaPoint.create({
      userId,
      points,
      action,
      description,
    })

    // Update user's total points
    await User.query().where('id', userId).increment('novaPoints', points)

    return novaPoint
  }

  /**
   * Add specific points to a user
   */
  static async addSpecificPoints(
    userId: number,
    points: number,
    action: string,
    description: string
  ) {
    const novaPoint = await NovaPoint.create({
      userId,
      points,
      action,
      description,
    })

    // Update user's total points
    await User.query().where('id', userId).increment('novaPoints', points)

    return novaPoint
  }

  /**
   * Delete points from a user
   */
  static async deletePoints(userId: number, points: number) {
    const user = await User.findOrFail(userId)

    if (user.novaPoints < points) {
      throw new Error(`User ${userId} does not have enough points to delete ${points} points`)
    }

    await User.query().where('id', userId).decrement('novaPoints', points)

    return await this.getUserTotalPoints(userId)
  }

  /**
   * Get points for a specific action
   */
  private static getPointsForAction(action: string): number {
    return this.POINTS[action as keyof typeof this.POINTS] || 0
  }

  /**
   * Get user's point history
   */
  static async getUserPointHistory(userId: number) {
    return await NovaPoint.query().where('userId', userId).orderBy('createdAt', 'desc')
  }

  /**
   * Get user's total points
   */
  static async getUserTotalPoints(userId: number): Promise<number> {
    const user = await User.findOrFail(userId)
    return user.novaPoints
  }

  /**
   * Get points leaderboard
   */
  static async getLeaderboard(limit: number = 10) {
    return await User.query()
      .orderBy('novaPoints', 'desc')
      .limit(limit)
      .select('id', 'username', 'novaPoints')
  }
}
