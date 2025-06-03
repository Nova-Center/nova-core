import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Post from '#models/post'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { UserRole } from '../types/user_role.enum.js'
import PostComment from '#models/post_comment'
import PostLike from '#models/post_like'
import Event from '#models/event'
import Service from './service.js'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  // @enum(user, admin, superadmin)
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

  @column()
  // @example(true)
  declare isBanned: boolean

  @column()
  // @example(Spamming)
  declare banReason: string | null

  @column()
  // @example(true)
  declare isOnline: boolean

  @column.dateTime()
  // @example(2024-03-20T15:30:00Z)
  declare lastSeenAt: DateTime | null

  @hasMany(() => Post)
  // @no-swagger
  declare posts: HasMany<typeof Post>

  @hasMany(() => PostComment)
  // @no-swagger
  declare postComments: HasMany<typeof PostComment>

  @hasMany(() => PostLike)
  // @no-swagger
  declare postLikes: HasMany<typeof PostLike>

  @hasMany(() => Service, {
    foreignKey: 'ownerId',
  })
  // @no-swagger
  declare services: HasMany<typeof Service>

  @hasMany(() => Service, {
    foreignKey: 'volunteerId',
  })
  // @no-swagger
  declare volunteeredServices: HasMany<typeof Service>

  @manyToMany(() => Event, {
    pivotTable: 'event_participants',
    pivotTimestamps: true,
  })
  // @no-swagger
  declare attendingEvents: ManyToMany<typeof Event>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30d',
  })
}
