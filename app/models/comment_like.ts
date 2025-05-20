import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import PostComment from '#models/post_comment'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class CommentLike extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare commentId: number

  @belongsTo(() => PostComment, {
    foreignKey: 'commentId',
  })
  declare comment: BelongsTo<typeof PostComment>

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
