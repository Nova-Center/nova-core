import { v4 as uuid } from 'uuid'
import { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import { UserRole } from '../types/user_role.enum.js'
import { createEventValidator } from '#validators/event'
import { DateTime } from 'luxon'
import User from '#models/user'
import { readFile } from 'node:fs/promises'
import { NovaPointService } from '#services/nova_point_service'
import { NotificationService } from '#services/notification_service'
import { NotificationType } from '../types/notification.enum.js'
import { MediaService } from '#services/media_service'

export default class EventsController {
  private async attachSignedEventImage<T extends { image?: string | null }>(event: T): Promise<T> {
    event.image = await MediaService.toResponseUrl(event.image ?? null)
    return event
  }

  private async attachSignedAvatar<T extends { avatar?: string | null }>(user: T): Promise<T> {
    user.avatar = await MediaService.toResponseUrl(user.avatar ?? null)
    return user
  }

  /**
   * @index
   * @summary Get all events
   * @description Get all events
   * @paramQuery page - The page number - @type(number)
   * @paramQuery per_page - The number of events per page - @type(number)
   * @responseBody 200 - <Event[]>.with(relations, participants.relations).exclude(user).paginated()
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)

    const events = await Event.query()
      .preload('participants')
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)

    const serializedEvents = events.serialize()
    serializedEvents.data = await Promise.all(
      serializedEvents.data.map(async (event) => {
        await this.attachSignedEventImage(event)
        if (event.participants?.length) {
          await Promise.all(
            event.participants.map((participant: { avatar?: string | null }) =>
              this.attachSignedAvatar(participant)
            )
          )
        }
        return event
      })
    )
    return response.ok(serializedEvents)
  }

  /**
   * @noPagination
   * @summary Get all events without pagination
   * @description Get all events without pagination
   * @responseBody 200 - <Event[]>
   */
  async noPagination({ response }: HttpContext) {
    const events = await Event.query().preload('participants').orderBy('created_at', 'desc')
    const serializedEvents = events.map((event) => event.serialize())
    const eventsWithSignedMedia = await Promise.all(
      serializedEvents.map(async (event) => {
        await this.attachSignedEventImage(event)
        if (event.participants?.length) {
          await Promise.all(
            event.participants.map((participant: { avatar?: string | null }) =>
              this.attachSignedAvatar(participant)
            )
          )
        }
        return event
      })
    )
    return response.ok(eventsWithSignedMedia)
  }

  /**
   * @show
   * @summary Get event by id
   * @description Get event by id
   * @responseBody 200 - <Event>
   */
  async show({ params, response }: HttpContext) {
    const event = await Event.query().where('id', params.id).preload('participants').firstOrFail()
    const serializedEvent = event.serialize()
    await this.attachSignedEventImage(serializedEvent)
    if (serializedEvent.participants?.length) {
      await Promise.all(
        serializedEvent.participants.map((participant: { avatar?: string | null }) =>
          this.attachSignedAvatar(participant)
        )
      )
    }
    return response.ok(serializedEvent)
  }

  /**
   * @store
   * @summary Create new event
   * @description Create new event
   * @requestBody <createEventValidator>
   * @responseBody 201 - <Event>
   */
  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createEventValidator)

    if (!data.image) {
      return response.badRequest({ message: 'Image is required' })
    }

    const event = new Event()

    const fileName = `${uuid()}.${data.image.clientName.split('.').pop()}`
    const objectKey = MediaService.buildObjectKey('events', fileName)

    if (!data.image.tmpPath) {
      throw new Error('Temporary file path is missing')
    }
    const fileBuffer = await readFile(data.image.tmpPath)

    await MediaService.putPrivateObject(objectKey, fileBuffer, data.image.clientName.split('.').pop())

    event.fill({
      ...data,
      image: objectKey,
      date: DateTime.fromJSDate(data.date),
      userId: auth.user!.id,
    })

    await NovaPointService.addPoints(auth.user!.id, 'CREATE_EVENT', `Created event: ${event.title}`)

    await event.save()

    const serializedEvent = event.serialize()
    await this.attachSignedEventImage(serializedEvent)
    return response.created(serializedEvent)
  }

  /**
   * @destroy
   * @summary Delete event
   * @description Delete event
   * @responseBody 204 - No content
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const event = await Event.findOrFail(params.id)

    if (
      event.userId !== user.id &&
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.SUPERADMIN
    ) {
      return response.unauthorized({ message: 'You are not authorized to delete this event' })
    }

    await MediaService.deleteByStoredValue(event.image)
    await event.delete()
    return response.noContent()
  }

  /**
   * @subscribe
   * @summary Subscribe to event
   * @description Subscribe to event
   * @responseBody 200 - { "message": "Successfully subscribed to event" }
   * @responseBody 400 - { "message": "Event is full" }
   * @responseBody 400 - { "message": "Already subscribed to this event" }
   */
  async subscribe({ params, response, auth }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'You must be logged in to subscribe to an event' })
    }

    const participantCount = await Event.query()
      .where('id', event.id)
      .whereHas('participants', (query) => {
        query.where('user_id', user.id)
      })
      .count('* as total')

    if (participantCount[0].$extras.total >= event.maxParticipants) {
      return response.badRequest({ message: 'Event is full' })
    }

    const isSubscribed = await Event.query()
      .where('id', event.id)
      .whereHas('participants', (query) => {
        query.where('user_id', user.id)
      })
      .first()

    if (isSubscribed) {
      return response.badRequest({ message: 'Already subscribed to this event' })
    }

    // Add notification to event owner
    await NotificationService.createNotification(
      event.userId,
      `${user.username} subscribed to your event: ${event.title}`,
      `${user.username} has subscribed to your event: ${event.title}`,
      NotificationType.EVENT_SUBSCRIBE
    )

    await event.related('participants').attach([user.id])

    return response.ok({ message: 'Successfully subscribed to event' })
  }

  /**
   * @unsubscribe
   * @summary Unsubscribe from event
   * @description Unsubscribe from event
   * @responseBody 200 - { "message": "Successfully unsubscribed from event" }
   */
  async unsubscribe({ params, response, auth }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'You must be logged in to unsubscribe from an event',
      })
    }

    const isSubscribed = await Event.query()
      .where('id', event.id)
      .whereHas('participants', (query) => {
        query.where('user_id', user.id)
      })
      .first()

    if (!isSubscribed) {
      return response.badRequest({ message: 'Not subscribed to this event' })
    }

    // Add notification to event owner
    await NotificationService.createNotification(
      event.userId,
      `${user.username} unsubscribed from your event: ${event.title}`,
      `${user.username} has unsubscribed from your event: ${event.title}`,
      NotificationType.EVENT_UNSUBSCRIBE
    )

    await event.related('participants').detach([user.id])
    return response.ok({ message: 'Successfully unsubscribed from event' })
  }

  /**
   * @unsubscribeByAdmin
   * @summary Unsubscribe from event by admin
   * @description Unsubscribe from event by admin
   * @responseBody 200 - { "message": "Successfully unsubscribed from event" }
   */
  async unsubscribeByAdmin({ params, response }: HttpContext) {
    const { eventId, userId } = params
    const event = await Event.findBy('id', eventId)

    if (!event) {
      return response.notFound({ message: 'Event not found' })
    }

    const user = await User.findBy('id', userId)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    // Check if user is subscribed to event
    const isSubscribed = await Event.query()
      .where('id', event.id)
      .whereHas('participants', (query) => {
        query.where('user_id', user.id)
      })
      .first()

    if (!isSubscribed) {
      return response.badRequest({ message: 'User is not subscribed to this event' })
    }

    await event?.related('participants').detach([user.id])

    // Add notification to event owner
    await NotificationService.createNotification(
      event.userId,
      `${user.username} unsubscribed from your event by admin: ${event.title}`,
      `${user.username} has unsubscribed from your event by admin: ${event.title}`,
      NotificationType.EVENT_UNSUBSCRIBE
    )

    return response.ok({ message: 'Successfully unsubscribed from event' })
  }

  /**
   * @stats
   * @summary Get event statistics
   * @description Get comprehensive statistics about events
   * @responseBody 200 - {
   *   totalEvents: number,
   *   averageParticipants: number,
   *   mostPopularEvents: Array<{id: number, title: string, participantCount: number}>,
   *   eventsByMonth: Array<{month: string, count: number}>,
   *   totalParticipants: number
   * }
   */
  async stats({ response }: HttpContext) {
    const totalEvents = await Event.query().count('* as total')

    const eventsWithParticipants = await Event.query()
      .preload('participants')
      .orderBy('created_at', 'desc')

    const avgParticipants =
      eventsWithParticipants.reduce((acc, event) => {
        return acc + event.participants.length
      }, 0) / (eventsWithParticipants.length || 1)

    const mostPopularEvents = await Event.query()
      .preload('participants')
      .orderBy('created_at', 'desc')
      .then((events) =>
        events
          .map((event) => ({
            id: event.id,
            title: event.title,
            participantCount: event.participants.length,
          }))
          .sort((a, b) => b.participantCount - a.participantCount)
          .slice(0, 5)
      )

    const eventsByMonth = await Event.query()
      .select('created_at')
      .orderBy('created_at', 'desc')
      .then((events) => {
        const months = new Map()
        events.forEach((event) => {
          const month = event.createdAt.toFormat('yyyy-MM')
          months.set(month, (months.get(month) || 0) + 1)
        })
        return Array.from(months.entries())
          .map(([month, count]) => ({ month, count }))
          .slice(0, 12)
      })

    const totalParticipants = eventsWithParticipants.reduce((acc, event) => {
      return acc + event.participants.length
    }, 0)

    return response.ok({
      totalEvents: totalEvents[0].$extras.total,
      averageParticipants: Math.round(avgParticipants),
      mostPopularEvents,
      eventsByMonth,
      totalParticipants,
    })
  }
}
