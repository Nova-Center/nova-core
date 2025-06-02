import app from '@adonisjs/core/services/app'
import WebSocketService from '#services/websocket_service'

app.ready(() => {
  WebSocketService.boot()
})
