import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'

export default class NotificationsController {
  /**
   * @index
   * @summary Get all notifications for the authenticated user
   * @description Get all notifications for the authenticated user
   * @responseBody 200 - <Notification[]>
   */
  public async index({ auth, response }: HttpContext) {
    const user = await auth.authenticate()

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' })
    }

    const notifications = await Notification.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')

    return response.json(notifications)
  }

  /**
   * @read
   * @summary Mark a notification as read
   * @description Mark a notification as read
   * @responseBody 200 - <Notification>
   */
  public async read({ request, response, auth }: HttpContext) {
    const { id } = request.params()
    const user = await auth.authenticate()

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' })
    }

    const notification = await Notification.find(id)

    if (!notification) {
      return response.status(404).json({ message: 'Notification not found' })
    }

    if (notification.userId !== user.id) {
      return response.status(403).json({ message: 'Forbidden' })
    }

    notification.isRead = true
    await notification.save()

    return response.json(notification)
  }
}
