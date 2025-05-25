import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }
  async run() {
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/post_seeder'))
    await this.seed(await import('#database/seeders/nova_point_seeder'))
    await this.seed(await import('#database/seeders/event_seeder'))
    await this.seed(await import('#database/seeders/news_seeder'))
  }
}
