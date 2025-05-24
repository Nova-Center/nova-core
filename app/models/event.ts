import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare title: string

  @column()
  declare image: string

  @column()
  declare description: string

  @column()
  declare maxParticipants: number

  @column()
  declare location: string

  @column.dateTime()
  declare date: DateTime

  @manyToMany(() => User, {
    pivotTable: 'event_participants',
    pivotTimestamps: true,
  })
  declare participants: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
