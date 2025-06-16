import vine from '@vinejs/vine'
import { NotificationType } from '../types/notification.enum.js'

export const createNotificationValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255),
    message: vine.string().minLength(3).maxLength(255),
    type: vine.enum(NotificationType),
  })
)
