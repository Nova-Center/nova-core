import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { NotificationType } from '../types/notification.enum.js'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  // @example(Post liked)
  declare title: string

  @column()
  // @example(John Doe liked your post)
  declare message: string

  @column()
  declare isRead: boolean

  @column()
  // @enum(POST_LIKE, POST_COMMENT, BAN_ADDED, BAN_REMOVED)
  declare type: NotificationType

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
