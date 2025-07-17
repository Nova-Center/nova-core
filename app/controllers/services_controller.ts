import Service from '#models/service'
import { createServiceValidator, proposeExchangeValidator } from '#validators/service'
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

    const { title, description, date, isExchangeOnly, desiredServiceDescription } =
      await request.validateUsing(createServiceValidator)

    const service = await Service.create({
      title,
      description,
      date,
      ownerId: user.id,
      isExchangeOnly: isExchangeOnly || false,
      desiredServiceDescription: desiredServiceDescription || null,
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

  /**
   * @proposeExchange
   * @summary Propose a service exchange
   * @description Propose to exchange a service with another service
   * @requestBody <proposeExchangeValidator>
   * @responseBody 200 - <Service>
   */
  public async proposeExchange({ request, response, auth }: HttpContext) {
    const { id } = request.params()
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Unauthorized',
      })
    }

    const targetService = await Service.find(id)

    if (!targetService) {
      return response.notFound({
        message: 'Target service not found',
      })
    }

    const { exchangeServiceId } = await request.validateUsing(proposeExchangeValidator)

    const exchangeService = await Service.find(exchangeServiceId)

    if (!exchangeService) {
      return response.notFound({
        message: 'Exchange service not found',
      })
    }

    if (exchangeService.ownerId !== user.id) {
      return response.unauthorized({
        message: 'You can only propose services that you own',
      })
    }

    if (targetService.volunteerId || targetService.exchangeServiceId) {
      return response.badRequest({
        message: 'This service already has a volunteer or exchange proposal',
      })
    }

    if (targetService.ownerId === user.id) {
      return response.badRequest({
        message: 'You cannot propose an exchange for your own service',
      })
    }

    // Update the target service with the exchange proposal
    targetService.exchangeServiceId = exchangeService.id
    await targetService.save()

    // Add notification for the service owner
    await NotificationService.createNotification(
      targetService.ownerId,
      `${user.username} proposed a service exchange for "${targetService.title}"`,
      `${user.username} has proposed to exchange their service "${exchangeService.title}" for your service "${targetService.title}"`,
      NotificationType.SERVICE_EXCHANGE_PROPOSAL
    )

    return response.json(targetService)
  }

  /**
   * @acceptExchange
   * @summary Accept a service exchange proposal
   * @description Accept a proposed service exchange
   * @responseBody 200 - <Service>
   */
  public async acceptExchange({ request, response, auth }: HttpContext) {
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

    if (service.ownerId !== user.id) {
      return response.unauthorized({
        message: 'Only the service owner can accept exchange proposals',
      })
    }

    if (!service.exchangeServiceId) {
      return response.badRequest({
        message: 'No exchange proposal exists for this service',
      })
    }

    const exchangeService = await Service.find(service.exchangeServiceId)

    if (!exchangeService) {
      return response.notFound({
        message: 'Exchange service not found',
      })
    }

    // Add Nova points for both users
    NovaPointService.addPoints(service.ownerId, 'EXCHANGE_SERVICE', 'Exchanged a service')
    NovaPointService.addPoints(exchangeService.ownerId, 'EXCHANGE_SERVICE', 'Exchanged a service')

    // Add notifications for both users
    await NotificationService.createNotification(
      exchangeService.ownerId,
      `Your service exchange proposal for "${service.title}" has been accepted`,
      `${user.username} has accepted your proposal to exchange "${exchangeService.title}" for "${service.title}"`,
      NotificationType.SERVICE_EXCHANGE_ACCEPTED
    )

    // Mark both services as having volunteers (each other's owners)
    service.volunteerId = exchangeService.ownerId
    exchangeService.volunteerId = service.ownerId

    await service.save()
    await exchangeService.save()

    return response.json(service)
  }

  /**
   * @cancelExchange
   * @summary Cancel a service exchange proposal
   * @description Cancel a proposed service exchange
   * @responseBody 200 - <Service>
   */
  public async cancelExchange({ request, response, auth }: HttpContext) {
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

    if (!service.exchangeServiceId) {
      return response.badRequest({
        message: 'No exchange proposal exists for this service',
      })
    }

    const exchangeService = await Service.find(service.exchangeServiceId)

    if (!exchangeService) {
      return response.notFound({
        message: 'Exchange service not found',
      })
    }

    // Check if the user is either the service owner or the exchange proposer
    if (service.ownerId !== user.id && exchangeService.ownerId !== user.id) {
      return response.unauthorized({
        message: 'Only the service owner or exchange proposer can cancel the exchange',
      })
    }

    // Add notification
    const notificationReceiverId =
      service.ownerId === user.id ? exchangeService.ownerId : service.ownerId
    await NotificationService.createNotification(
      notificationReceiverId,
      `Service exchange proposal for "${service.title}" has been cancelled`,
      `The service exchange proposal between "${service.title}" and "${exchangeService.title}" has been cancelled`,
      NotificationType.SERVICE_EXCHANGE_CANCELLED
    )

    // Clear the exchange proposal
    service.exchangeServiceId = null
    await service.save()

    return response.json(service)
  }
}
