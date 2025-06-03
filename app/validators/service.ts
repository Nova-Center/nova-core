import vine from '@vinejs/vine'

export const createServiceValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(30),
    description: vine.string().minLength(3).maxLength(255),
    date: vine.date().after(new Date().toISOString()),
  })
)
