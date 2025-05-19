import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Post from '#models/post'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class PostComment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare likes: number

  @column()
  declare postId: number

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
