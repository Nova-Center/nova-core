import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shop_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('owner_id').references('users.id')
      table.integer('client_id').references('users.id').nullable()

      table.string('name').notNullable()
      table.string('description').notNullable()
      table.integer('price').notNullable()
      table.string('image').notNullable()

      table.dateTime('date_purchase').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
