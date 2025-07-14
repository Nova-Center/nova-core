import Service from '#models/service'
import { createServiceValidator } from '#validators/service'
import type { HttpContext } from '@adonisjs/core/http'
import { UserRole } from '../types/user_role.enum.js'
import { NovaPointService } from '#services/nova_point_service'
import { NotificationService } from '#services/notification_service'
import { NotificationType } from '../types/notification.enum.js'

export default class ServicesController {
  /**
   * @store
   * @description Create a new service
   * @requestBody <createServiceValidator>
   * @responseBody 201 - <Service>
   */
  public async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Unauthorized',
      })
    }

    const { title, description, date } = await request.validateUsing(createServiceValidator)

    const service = await Service.create({
      title,
      description,
      date,
      ownerId: user.id,
    })

    return response.created(service)
  }

  /**
   * @index
   * @description Get all services
   * @responseBody 200 - <Service[]>.paginated()
   * @paramQuery page - The page number - @type(number)
   * @paramQuery per_page - The number of services per page - @type(number)
   */
  public async index({ request, response }: HttpContext) {
    const { page, perPage } = request.only(['page', 'perPage'])

    const services = await Service.query().paginate(page, perPage)

    return response.json(services)
  }

  /**
   * @noPagination
   * @summary Get all services without pagination
   * @description Get all services without pagination
   * @responseBody 200 - <Service[]>
   */
  public async noPagination({ response }: HttpContext) {
    const services = await Service.query().orderBy('created_at', 'desc')
    return response.json(services)
  }

  /**
   * @show
   * @description Get a service by id
   * @responseBody 200 - <Service>
   */
  public async show({ request, response }: HttpContext) {
    const { id } = request.params()

    const service = await Service.find(id)

    if (!service) {
      return response.notFound({
        message: 'Service not found',
      })
    }

    return response.json(service)
  }

  /**
   * @destroy
   * @summary Delete a service
   * @description Delete a service
   * @responseBody 204 - No content
   */
  public async destroy({ request, response, auth }: HttpContext) {
    const { id } = request.params()
    const user = auth.user

    if (!user) {
      return response.unauthorized()
    }

    const service = await Service.find(id)

    if (!service) {
      return response.notFound({
        message: 'Service not found',
      })
    }

    if (
      service.ownerId !== user.id &&
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.SUPERADMIN
    ) {
      return response.unauthorized()
    }

    await service.delete()

    return response.noContent()
  }

  /**
   * @volunteer
   * @summary Volunteer for the service
   * @description Volunteer for the service
   * @responseBody 200 - <Service>
   */
  public async volunteer({ request, response, auth }: HttpContext) {
    const { id } = request.params()
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Unauthorized',
      })
    }

    const service = await Service.find(id)

    if (!service) {
      return response.notFound({
        message: 'Service not found',
      })
    }

    if (service.volunteerId) {
      return response.badRequest({ message: 'Service already has a volunteer' })
    }

    if (service.ownerId === user.id) {
      return response.badRequest({ message: 'You cannot volunteer for your own service' })
    }

    NovaPointService.addPoints(user.id, 'VOLUNTEER_SERVICE', 'Volunteered for a service')

    // Add notification to service owner
    await NotificationService.createNotification(
      service.ownerId,
      `${user.username} volunteered for your service ${service.title}`,
      `${user.username} has volunteered for your service ${service.title}`,
      NotificationType.SERVICE_VOLUNTEER
    )

    service.volunteerId = user.id
    await service.save()

    return response.json(service)
  }

  /**
   * @unvolunteer
   * @summary Unvolunteer from the service
   * @description Unvolunteer from the service
   * @responseBody 200 - <Service>
   */
  public async unvolunteer({ request, response, auth }: HttpContext) {
    const { id } = request.params()
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Unauthorized',
      })
    }

    const service = await Service.find(id)

    if (!service) {
      return response.notFound({
        message: 'Service not found',
      })
    }

    if (service.volunteerId !== user.id) {
      return response.badRequest({ message: 'You are not a volunteer for this service' })
    }

    // Add notification to service owner

    await NotificationService.createNotification(
      service.ownerId,
      `${user.username} unvolunteered from your service ${service.title}`,
      `${user.username} has unvolunteered from your service ${service.title}`,
      NotificationType.SERVICE_UNVOLUNTEER
    )

    service.volunteerId = null
    await service.save()

    return response.json(service)
  }
}
