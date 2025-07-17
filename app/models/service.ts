import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare date: Date

  @column()
  declare ownerId: number

  @belongsTo(() => User)
  declare owner: BelongsTo<typeof User>

  @column()
  declare volunteerId: number | null

  @belongsTo(() => User)
  declare volunteer: BelongsTo<typeof User>

  @column()
  declare exchangeServiceId: number | null

  @belongsTo(() => Service, {
    foreignKey: 'exchangeServiceId',
  })
  declare exchangeService: BelongsTo<typeof Service>

  @column()
  declare desiredServiceDescription: string | null

  @column()
  declare isExchangeOnly: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
