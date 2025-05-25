import type { HttpContext } from '@adonisjs/core/http'
import News from '#models/news'
import { createNewsValidator, updateNewsValidator } from '#validators/news'
import { UserRole } from '../types/user_role.enum.js'

export default class NewsController {
  /**
   * @index
   * @summary Get all news
   * @description Get all news
   * @paramQuery page - The page number - @type(number)
   * @paramQuery limit - The number of news per page - @type(number)
   * @responseBody 200 - <News[]>
   */
  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const news = await News.query().orderBy('created_at', 'desc').paginate(page, limit)

    return response.json(news)
  }

  /**
   * @show
   * @summary Get a news by id
   * @description Get a news by id
   * @paramParam id - The id of the news - @type(number)
   * @responseBody 200 - <News>
   */
  public async show({ request, response }: HttpContext) {
    const id = request.param('id')
    const news = await News.findBy('id', id)

    if (!news) {
      return response.notFound({ message: `News with id ${id} not found` })
    }

    return response.json(news)
  }

  /**
   * @store
   * @summary Create a new news
   * @description Create a new news
   * @requestBody <createNewsValidator>
   * @responseBody 201 - <News>
   */
  public async store({ auth, request, response }: HttpContext) {
    const payload = await createNewsValidator.validate(
      request.only(['title', 'content', 'excerpt', 'tags'])
    )

    const news = new News()

    news.fill({
      ...payload,
      userId: auth.user!.id,
    })

    await news.save()

    return response.created(news)
  }

  /**
   * @update
   * @summary Update a news
   * @description Update a news
   * @paramParam id - The id of the news - @type(number)
   * @requestBody <createNewsValidator>
   * @responseBody 200 - <News>
   */
  public async update({ auth, request, response, logger }: HttpContext) {
    const { id } = request.params()
    const news = await News.findBy('id', id)
    logger.info(news)

    if (!news) {
      return response.notFound({ message: `News with id ${id} not found` })
    }

    if (
      news.userId !== auth.user!.id &&
      auth.user!.role !== UserRole.ADMIN &&
      auth.user!.role !== UserRole.SUPERADMIN
    ) {
      return response.unauthorized()
    }

    const payload = await updateNewsValidator.validate(
      request.only(['title', 'content', 'excerpt', 'tags'])
    )

    news.merge(payload)

    await news.save()

    return response.json(news)
  }

  /**
   * @destroy
   * @summary Delete a news
   * @description Delete a news
   * @responseBody 204 - <News>
   */
  public async destroy({ auth, request, response }: HttpContext) {
    const id = request.param('id')
    const news = await News.findBy('id', id)

    if (!news) {
      return response.notFound({ message: `News with id ${id} not found` })
    }

    if (
      news.userId !== auth.user!.id &&
      auth.user!.role !== UserRole.ADMIN &&
      auth.user!.role !== UserRole.SUPERADMIN
    ) {
      return response.unauthorized()
    }

    await news.delete()
    return response.status(204).json({ message: 'News deleted successfully' })
  }
}
