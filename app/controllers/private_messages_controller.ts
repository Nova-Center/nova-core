import { HttpContext } from '@adonisjs/core/http'
import PrivateMessage from '#models/private_message'
import WebSocketService from '#services/websocket_service'

export default class PrivateMessagesController {
  /**
   * Get conversation history between two users
   */
  async getConversation({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const userId = user.id
    const otherUserId = request.param('otherUserId')

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
  async markAsRead({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const userId = user.id
    const senderId = request.param('senderId')

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
  async getUnreadCount({ auth, response }: HttpContext) {
    const user = auth.user!
    const userId = user.id

    const count = await PrivateMessage.query()
      .where('receiver_id', userId)
      .where('is_read', false)
      .count('* as total')

    return response.json({ count: count[0].$extras.total })
  }
}
