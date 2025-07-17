import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('exchange_service_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('services')
      table.text('desired_service_description').nullable()
      table.boolean('is_exchange_only').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('exchange_service_id')
      table.dropColumn('desired_service_description')
      table.dropColumn('is_exchange_only')
    })
  }
}
