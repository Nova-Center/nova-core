import NovaPoint from '#models/nova_point'
import User from '#models/user'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

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
  static async deletePoints(userId: number, points: number, description: string) {
    const user = await User.findOrFail(userId)

    if (user.novaPoints < points) {
      throw new Error(`User ${userId} does not have enough points to delete ${points} points`)
    }

    await NovaPoint.create({
      userId,
      points: -points,
      action: 'REMOVE_POINTS',
      description,
    })

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

  /**
   * Get NovaPoints statistics
   */
  static async getStats() {
    const users = await User.query()
    const totalPoints = users.reduce((sum, user) => sum + user.novaPoints, 0)
    const averagePoints = users.length > 0 ? totalPoints / users.length : 0

    const distribution = [
      { range: '0-100', count: 0 },
      { range: '101-500', count: 0 },
      { range: '501-1000', count: 0 },
      { range: '1001-5000', count: 0 },
      { range: '5000+', count: 0 },
    ]

    users.forEach((user) => {
      const points = user.novaPoints
      if (points <= 100) distribution[0].count++
      else if (points <= 500) distribution[1].count++
      else if (points <= 1000) distribution[2].count++
      else if (points <= 5000) distribution[3].count++
      else distribution[4].count++
    })

    // Get points history (last 30 days)
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQL()
    const pointsHistory = await NovaPoint.query()
      .select(db.raw('DATE(created_at) as date'))
      .select(db.raw('SUM(points) as total'))
      .where('created_at', '>=', thirtyDaysAgo)
      .groupBy('date')
      .orderBy('date')

    return {
      totalPoints,
      averagePoints,
      pointsDistribution: distribution,
      pointsHistory: pointsHistory.map((item) => ({
        date: item.$extras.date,
        total: Number(item.$extras.total),
      })),
    }
  }
}
