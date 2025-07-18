import env from '#start/env'
import { defineConfig, services } from '@adonisjs/drive'

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK') as 's3',

  /**
   * The services object can be used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: {
    s3: services.s3({
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID') as string,
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY') as string,
      },
      region: env.get('AWS_REGION') as string,
      bucket: env.get('S3_BUCKET') as string,
      endpoint: env.get('S3_ENDPOINT') as string,
      forcePathStyle: true,
      visibility: 'public',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
