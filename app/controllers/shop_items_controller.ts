import type { HttpContext } from '@adonisjs/core/http'
import { createShopItemValidator, updateShopItemValidator } from '#validators/shop_item'
import ShopItem from '#models/shop_item'
import drive from '@adonisjs/drive/services/main'
import { v4 as uuid } from 'uuid'
import { readFile } from 'node:fs/promises'
import { DateTime } from 'luxon'

export default class ShopItemsController {
  /**
   * @store
   * @description Create a new item
   * @requestBody <createShopItemValidator>
   * @responseBody 201 - <ShopItem>
   */
  public async store({ request, response, auth }: HttpContext) {
    const { name, description, price, image } = await createShopItemValidator.validate(
      request.body()
    )
    const user = auth.user

    if (!user) {
      return response.unauthorized()
    }

    const fileName = `${uuid()}.${image.extname}`
    const imageBuffer = await readFile(image.tmpPath!)

    await drive.use('s3').put(`shop_items/${fileName}`, imageBuffer, {
      contentType: image.type,
      visibility: 'public',
    })

    const imageUrl = await drive.use('s3').getUrl(`shop_items/${fileName}`)

    const shopItem = await ShopItem.create({
      name,
      description,
      price,
      image: imageUrl,
      ownerId: user.id,
    })

    return response.created(shopItem)
  }

  /**
   * @index
   * @description Get all items
   * @responseBody 200 - <ShopItem[]>.paginated()
   * @paramQuery page - The page number - @type(number)
   * @paramQuery per_page - The number of items per page - @type(number)
   */
  public async index({ request, response }: HttpContext) {
    const { page, perPage } = request.only(['page', 'perPage'])

    const shopItems = await ShopItem.query()
      .preload('owner')
      .preload('client')
      .paginate(page, perPage)

    return response.json(shopItems)
  }

  /**
   * @show
   * @description Get an item by id
   * @responseBody 200 - <ShopItem>
   */
  public async show({ request, response }: HttpContext) {
    const { id } = request.params()

    const shopItem = await ShopItem.find(id)

    if (!shopItem) {
      return response.notFound()
    }

    return response.json(shopItem)
  }

  /**
   * @destroy
   * @description Delete an item by id
   * @responseBody 200 - <ShopItem>
   */
  public async destroy({ request, response }: HttpContext) {
    const { id } = request.params()

    const shopItem = await ShopItem.find(id)

    if (!shopItem) {
      return response.notFound()
    }

    if (shopItem.image) {
      await drive.use('s3').delete(`shop_items/${shopItem.image.split('/').pop()}`)
    }

    await shopItem.delete()

    return response.noContent()
  }

  /**
   * @update
   * @description Update an item by id
   * @requestBody <updateShopItemValidator>
   * @responseBody 200 - <ShopItem>
   */
  public async update({ request, response }: HttpContext) {
    const { id } = request.params()
    const newItem = await updateShopItemValidator.validate(request.body())

    const shopItem = await ShopItem.find(id)

    if (!shopItem) {
      return response.notFound()
    }

    if (newItem.image) {
      await drive.use('s3').delete(`shop_items/${shopItem.image.split('/').pop()}`)

      const fileName = `${uuid()}.${newItem.image.extname}`
      const imageBuffer = await readFile(newItem.image.tmpPath!)

      await drive.use('s3').put(`shop_items/${fileName}`, imageBuffer, {
        contentType: newItem.image.type,
        visibility: 'public',
      })

      const imageUrl = await drive.use('s3').getUrl(`shop_items/${fileName}`)

      shopItem.image = imageUrl
    }

    shopItem.name = newItem.name ?? shopItem.name
    shopItem.description = newItem.description ?? shopItem.description
    shopItem.price = newItem.price ?? shopItem.price
    shopItem.clientId = newItem.clientId ?? shopItem.clientId
    shopItem.ownerId = newItem.ownerId ?? shopItem.ownerId
    shopItem.datePurchase = newItem.datePurchase
      ? DateTime.fromJSDate(newItem.datePurchase)
      : shopItem.datePurchase

    await shopItem.save()

    return response.json(shopItem)
  }

  /**
   * @purchase
   * @summary Purchase an item
   * @description Purchase an item by id
   * @responseBody 200 - <ShopItem>
   */
  public async purchase({ request, response, auth }: HttpContext) {
    const { id } = request.params()
    const user = auth.user

    if (!user) {
      return response.unauthorized()
    }

    const shopItem = await ShopItem.find(id)

    if (!shopItem) {
      return response.notFound()
    }

    if (shopItem.clientId) {
      return response.badRequest('Shop item already purchased')
    }

    shopItem.clientId = user.id
    shopItem.datePurchase = DateTime.now()

    await shopItem.save()

    return response.json(shopItem)
  }
}
