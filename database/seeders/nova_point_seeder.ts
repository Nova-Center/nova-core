import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import NovaPoint from '#models/nova_point'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()

    for (const user of users) {
      if (user.novaPoints > 0) {
        await NovaPoint.create({
          userId: user.id,
          points: user.novaPoints,
          action: 'INITIAL_POINTS',
          description: 'Points initiaux',
          createdAt: DateTime.now().minus({ days: 30 }),
          updatedAt: DateTime.now().minus({ days: 30 }),
        })
      }
    }
  }
}
