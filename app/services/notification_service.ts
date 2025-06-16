import Notification from '#models/notification'
import { NotificationType } from '../types/notification.enum.js'

class NotificationService {
  public static async createNotification(
    userId: number,
    title: string,
    message: string,
    type: NotificationType
  ): Promise<Notification> {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
    })

    return notification
  }
}

export default new NotificationService()
