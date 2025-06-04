import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ShopItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ownerId: number

  @belongsTo(() => User)
  declare owner: BelongsTo<typeof User>

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare image: string

  @column()
  declare clientId: number | null

  @belongsTo(() => User)
  declare client: BelongsTo<typeof User>

  @column()
  declare datePurchase: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
