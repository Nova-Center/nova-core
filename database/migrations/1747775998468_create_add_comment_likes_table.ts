import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comment_likes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('comment_id')
        .references('id')
        .inTable('post_comments')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
