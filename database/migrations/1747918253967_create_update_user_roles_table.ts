import { BaseSchema } from '@adonisjs/lucid/schema'
import { UserRole } from '../../app/types/user_role.enum.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    await this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
    })

    await this.schema.alterTable(this.tableName, (table) => {
      table.enum('role', Object.values(UserRole)).defaultTo(UserRole.USER).notNullable()
    })
  }

  async down() {
    await this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
    })

    await this.schema.alterTable(this.tableName, (table) => {
      table.enum('role', ['user']).defaultTo('user').notNullable()
    })
  }
}
