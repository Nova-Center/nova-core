import vine from '@vinejs/vine'

export const createEventValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(100),
    image: vine.file({
      size: 1024 * 1024 * 5, // 5MB
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    }),
    description: vine.string().trim().minLength(10),
    maxParticipants: vine.number().positive(),
    location: vine.string().trim().minLength(3),
    date: vine.date({
      formats: ['iso8601'],
    }),
  })
)

export const updateEventValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(100).optional(),
    image: vine
      .file({
        size: 1024 * 1024 * 5, // 5MB
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      })
      .optional(),
    description: vine.string().trim().minLength(10).optional(),
    maxParticipants: vine.number().positive().optional(),
    location: vine.string().trim().minLength(3).optional(),
    date: vine
      .date({
        formats: ['iso8601'],
      })
      .optional(),
  })
)
