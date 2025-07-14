import { HttpContext } from '@adonisjs/core/http'
import PrivateMessage from '#models/private_message'
import WebSocketService from '#services/websocket_service'

export default class PrivateMessagesController {
  /**
   * @getConversation
   * @summary Get conversation history between two users
   * @description This method returns the conversation history between two users.
   * @responseBody 200 - <PrivateMessage[]>
   * @responseBody 404 - { message: 'No messages found' }
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

    if (messages.length === 0) {
      return response.status(404).json({ message: 'No messages found' })
    }

    return response.json(messages)
  }

  /**
   * @getAllLastMessages
   * @summary Get all last messages for the current user
   * @description This method returns all last messages for the current user.
   * @responseBody 200 - <PrivateMessage[]>
   * @responseBody 404 - { message: 'No messages found' }
   */
  async getAllLastMessages({ auth, response }: HttpContext) {
    const user = auth.user!
    const userId = user.id

    const messages = await PrivateMessage.query()
      .distinctOn(['sender_id', 'receiver_id'])
      .where((query) => {
        query.where('receiver_id', userId).orWhere('sender_id', userId)
      })
      .orderBy('sender_id')
      .orderBy('receiver_id')
      .orderBy('created_at', 'desc')

    return response.json(messages)
  }

  /**
   * @markAsRead
   * @summary Mark messages as read
   * @description This method marks the messages as read.
   * @responseBody 200 - { message: 'Messages marked as read' }
   * @responseBody 404 - { message: 'No messages found' }
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
   * @getUnreadCount
   * @summary Get unread messages count
   * @description This method returns the number of unread messages for the current user.
   * @responseBody 200 - { count: <number> }
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
