import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3).maxLength(20).optional(),
    firstName: vine.string().trim().minLength(3).maxLength(20).optional(),
    lastName: vine.string().trim().minLength(3).maxLength(20).optional(),
    birthDate: vine
      .string()
      .trim()
      .optional()
      .transform((value) => (value ? new Date(value) : undefined)),
    email: vine.string().trim().email().optional(),
    password: vine.string().trim().minLength(6).maxLength(20).optional(),
    avatar: vine
      .file({
        size: 1024 * 1024 * 5, // 5MB
        extnames: ['jpg', 'jpeg', 'png', 'gif'],
      })
      .nullable()
      .optional(),
  })
)
