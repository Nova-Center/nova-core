import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import PostComment from '#models/post_comment'
import PostLike from '#models/post_like'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare content: string

  @column()
  // @example(https://example.com/image.jpg)
  declare image: string | null

  @hasMany(() => PostComment)
  declare comments: HasMany<typeof PostComment>

  @hasMany(() => PostLike)
  declare likes: HasMany<typeof PostLike>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
