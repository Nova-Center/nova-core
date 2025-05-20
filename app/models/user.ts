import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Post from '#models/post'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { UserRole } from '../types/enums.js'
import PostComment from '#models/post_comment'
import PostLike from '#models/post_like'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  // @enum(user, admin)
  declare role: UserRole

  @column()
  // @example(sagby)
  declare username: string

  @column()
  // @example(Salah)
  declare firstName: string

  @column()
  // @example(Gory)
  declare lastName: string

  @column()
  // @example(1990-01-01)
  declare birthDate: Date

  @column()
  // @example(sagby@gmail.com)
  declare email: string

  @column({ serializeAs: null })
  // @example(MyP@ssw0rd!)
  declare password: string

  @column()
  // @example(https://example.com/avatar.png)
  declare avatar: string | null

  @column()
  // @example(155)
  declare novaPoints: number

  @hasMany(() => Post)
  // @no-swagger
  declare posts: HasMany<typeof Post>

  @hasMany(() => PostComment)
  // @no-swagger
  declare postComments: HasMany<typeof PostComment>

  @hasMany(() => PostLike)
  // @no-swagger
  declare postLikes: HasMany<typeof PostLike>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30d',
  })
}
