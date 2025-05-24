import { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import { UserRole } from '../types/user_role.enum.js'
import { createEventValidator } from '#validators/event'
import { DateTime } from 'luxon'

export default class EventsController {
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
    return response.ok(events)
  }

  /**
   * @show
   * @summary Get event by id
   * @description Get event by id
   * @responseBody 200 - <Event>
   */
  async show({ params, response }: HttpContext) {
    const event = await Event.query().where('id', params.id).preload('participants').firstOrFail()
    return response.ok(event)
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
    const event = await Event.create({
      ...data,
      date: DateTime.fromJSDate(data.date),
      userId: auth.user!.id,
    })
    return response.created(event)
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
    const user = auth.user!

    const participantCount = await event.related('participants').query().count('* as total')
    if (participantCount[0].$extras.total >= event.maxParticipants) {
      return response.badRequest({ message: 'Event is full' })
    }

    const isSubscribed = await event.related('participants').query().where('id', user.id).first()
    if (isSubscribed) {
      return response.badRequest({ message: 'Already subscribed to this event' })
    }

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
    const user = auth.user!

    const isSubscribed = await event.related('participants').query().where('id', user.id).first()
    if (!isSubscribed) {
      return response.badRequest({ message: 'Not subscribed to this event' })
    }

    await event.related('participants').detach([user.id])
    return response.ok({ message: 'Successfully unsubscribed from event' })
  }
}
