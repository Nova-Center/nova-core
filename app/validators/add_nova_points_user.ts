import vine from '@vinejs/vine'

export const addNovaPointsUser = vine.compile(
  vine.object({
    action: vine.string().trim().minLength(3).maxLength(20),
    description: vine.string().trim().minLength(3).maxLength(100),
    points: vine.number().positive().optional(),
  })
)
