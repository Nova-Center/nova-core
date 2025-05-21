import { BaseSchema } from '@adonisjs/lucid/schema'
import { UserRole } from '../../app/types/user_role.enum.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.enum('role', Object.values(UserRole)).defaultTo(UserRole.USER).notNullable()
      table.string('username').notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.date('birth_date').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
