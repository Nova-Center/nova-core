import vine from '@vinejs/vine'

export const removeNovaPointsUser = vine.compile(
  vine.object({
    points: vine.number().positive(),
    description: vine.string().trim().minLength(3).maxLength(100),
  })
)
