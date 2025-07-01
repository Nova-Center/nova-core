import { HttpContext } from '@adonisjs/core/http'
import PrivateMessage from '#models/private_message'
import WebSocketService from '#services/websocket_service'

export default class PrivateMessagesController {
  /**
   * Get conversation history between two users
   */
  async getConversation({ request, response }: HttpContext) {
    const userId = request.input('userId')
    const otherUserId = request.input('otherUserId')

    const messages = await PrivateMessage.query()
      .where((query) => {
        query
          .where('sender_id', userId)
          .where('receiver_id', otherUserId)
          .orWhere((subQuery) => {
            subQuery.where('sender_id', otherUserId).where('receiver_id', userId)
          })
      })
      .orderBy('created_at', 'asc')
      .preload('sender')
      .preload('receiver')

    return response.json(messages)
  }

  /**
   * Mark messages as read
   */
  async markAsRead({ request, response }: HttpContext) {
    const userId = request.input('userId')
    const senderId = request.input('senderId')

    await PrivateMessage.query()
      .where('sender_id', senderId)
      .where('receiver_id', userId)
      .where('is_read', false)
      .update({ is_read: true })

    WebSocketService.emitMessageRead(senderId, userId)

    return response.status(200)
  }

  /**
   * Get unread messages count
   */
  async getUnreadCount({ request, response }: HttpContext) {
    const userId = request.input('userId')

    const count = await PrivateMessage.query()
      .where('receiver_id', userId)
      .where('is_read', false)
      .count('* as total')

    return response.json({ count: count[0].$extras.total })
  }
}
