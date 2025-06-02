import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import User from '#models/user'
import { DateTime } from 'luxon'

class WebSocketService {
  io: Server | undefined
  private booted = false
  private userSockets: Map<number, string[]> = new Map()

  boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: '*',
      },
    })

    this.io.on('connection', async (socket) => {
      const userId = socket.handshake.auth.userId
      if (!userId) {
        socket.disconnect()
        return
      }

      // Add socket to user's sockets
      const userSockets = this.userSockets.get(userId) || []
      userSockets.push(socket.id)
      this.userSockets.set(userId, userSockets)

      // Update user's online status
      const user = await User.find(userId)
      if (user) {
        user.isOnline = true
        user.lastSeenAt = DateTime.now()
        await user.save()
        this.io?.emit('user:status', { userId, isOnline: true })
      }

      // Handle disconnection
      socket.on('disconnect', async () => {
        const remainingSockets = this.userSockets.get(userId) || []
        const index = remainingSockets.indexOf(socket.id)
        if (index > -1) {
          remainingSockets.splice(index, 1)
        }

        if (remainingSockets.length === 0) {
          this.userSockets.delete(userId)
          const disconnectedUser = await User.find(userId)
          if (disconnectedUser) {
            disconnectedUser.isOnline = false
            disconnectedUser.lastSeenAt = DateTime.now()
            await disconnectedUser.save()
            this.io?.emit('user:status', { userId, isOnline: false })
          }
        }
      })
    })
  }

  /**
   * Get all online users
   */
  async getOnlineUsers() {
    return await User.query().where('is_online', true)
  }

  /**
   * Get user's online status
   */
  async getUserStatus(userId: number) {
    const user = await User.find(userId)
    return {
      isOnline: user?.isOnline || false,
      lastSeenAt: user?.lastSeenAt,
    }
  }
}

export default new WebSocketService()
