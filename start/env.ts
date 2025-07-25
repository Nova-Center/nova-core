/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

// this is necessary to make sure that the `DocsGenerate` command will run in CI/CD pipelines without setting environment variables
const isNodeAce = process.argv.some((arg) => arg.endsWith('/ace') || arg === 'ace')

export default await Env.create(
  new URL('../', import.meta.url),
  isNodeAce
    ? {}
    : {
        NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
        PORT: Env.schema.number(),
        APP_KEY: Env.schema.string(),
        HOST: Env.schema.string({ format: 'host' }),
        LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

        /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
        DB_HOST: Env.schema.string({ format: 'host' }),
        DB_PORT: Env.schema.number(),
        DB_USER: Env.schema.string(),
        DB_PASSWORD: Env.schema.string.optional(),
        DB_DATABASE: Env.schema.string(),

        /*
  |----------------------------------------------------------
  | Variables for configuring the drive package
  |----------------------------------------------------------
  */
        DRIVE_DISK: Env.schema.enum(['s3'] as const),
        AWS_ACCESS_KEY_ID: Env.schema.string(),
        AWS_SECRET_ACCESS_KEY: Env.schema.string(),
        AWS_REGION: Env.schema.string(),
        S3_BUCKET: Env.schema.string(),
      }
)
