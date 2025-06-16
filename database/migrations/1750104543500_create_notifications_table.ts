import { BaseSchema } from '@adonisjs/lucid/schema'
import { NotificationType } from '../../app/types/notification.enum.js'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('users.id')
      table.string('title')
      table.string('message')
      table.boolean('is_read').defaultTo(false)
      table.enum('type', Object.values(NotificationType))

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
