import vine from '@vinejs/vine'

export const createEventValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(100),
    image: vine.string().trim(),
    description: vine.string().trim().minLength(10),
    maxParticipants: vine.number().positive(),
    location: vine.string().trim().minLength(3),
    date: vine.date(),
  })
)

export const updateEventValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(100).optional(),
    image: vine.string().trim().optional(),
    description: vine.string().trim().minLength(10).optional(),
    maxParticipants: vine.number().positive().optional(),
    location: vine.string().trim().minLength(3).optional(),
    date: vine.date().optional(),
  })
)
