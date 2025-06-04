import vine from '@vinejs/vine'

export const createShopItemValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(50),
    description: vine.string().minLength(10).maxLength(255),
    price: vine.number().min(0),
    image: vine.file({
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    }),
  })
)

export const updateShopItemValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(50).optional(),
    clientId: vine.number().optional(),
    ownerId: vine.number().optional(),
    description: vine.string().minLength(10).maxLength(255).optional(),
    price: vine.number().min(0).optional(),
    image: vine
      .file({
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      })
      .optional(),
    datePurchase: vine.date().optional(),
  })
)
