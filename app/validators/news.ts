import vine from '@vinejs/vine'

export const createNewsValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    content: vine.string().minLength(10).maxLength(10000),
    excerpt: vine.string().minLength(10).maxLength(1000).optional(),
    tags: vine.array(vine.string()).optional(),
  })
)

export const updateNewsValidator = vine.compile(
  vine.object({
    title: vine.string().trim().optional(),
    content: vine.string().minLength(10).maxLength(10000).optional(),
    excerpt: vine.string().minLength(10).maxLength(1000).optional(),
    tags: vine.array(vine.string()).optional(),
  })
)
