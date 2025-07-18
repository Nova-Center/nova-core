import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      seeders: {
        paths: ['./database/seeders/main'],
      },
      connection: {
        host: env.get('DB_HOST') as string,
        port: env.get('DB_PORT') as number,
        user: env.get('DB_USER') as string,
        password: env.get('DB_PASSWORD') as string,
        database: env.get('DB_DATABASE') as string,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
