import vine from '@vinejs/vine'

export const banUserValidator = vine.compile(
  vine.object({
    reason: vine.string().minLength(5).maxLength(255),
  })
)
