import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { updateUserValidator } from '#validators/update_user'
import { readFile } from 'node:fs/promises'
import { v4 as uuid } from 'uuid'
import drive from '@adonisjs/drive/services/main'
import { UserRole } from '../types/user_role.enum.js'

export default class UsersController {
  /**
   * @index
   * @description Get all users
   * @requestBody <User>
   * @responseBody 200 - <User>
   */
  public async index({ auth, request, response, logger }: HttpContext) {
    const { page, perPage } = request.only(['page', 'perPage'])
    const users = await User.query().paginate(page, perPage)
    logger.info({ auth: auth.user?.username }, 'Users fetched by')
    return response.json(users)
  }

  /**
   * @show
   * @description Get a user by id
   * @requestBody <User>
   * @responseBody 200 - <User>
   */
  public async show({ request, response }: HttpContext) {
    const { id } = request.params()

    if (Number.isNaN(+id)) {
      return response.badRequest({ message: 'Invalid user id' })
    }

    const user = await User.find(id)

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    return response.json(user)
  }

  /**
   * @me
   * @summary Get the current user
   * @description Get the current user
   * @requestBody <User>
   * @responseBody 200 - <User>
   */
  public async me({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Not authenticated' })
    }

    return response.json(user)
  }

  /**
   * @update
   * @description Update a user's information
   * @requestBody <updateUserValidator>
   * @responseBody 200 - <User>
   */
  public async update({ request, response, logger }: HttpContext) {
    const { id } = request.params()
    const user = await User.find(id)

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    const data = await request.validateUsing(updateUserValidator)

    if (data.email && data.email !== user.email && (await User.findBy('email', data.email))) {
      logger.warn('Email already exists')
      return response.badRequest({ message: 'Email already exists' })
    }

    if (
      data.username &&
      data.username !== user.username &&
      (await User.findBy('username', data.username))
    ) {
      logger.warn('Username already exists')
      return response.badRequest({ message: 'Username already exists' })
    }

    const updateData: Partial<User> = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      email: data.email,
      password: data.password,
    }

    if (data.avatar === null) {
      if (user.avatar) {
        const oldAvatarUrl = user.avatar.split('/').pop()
        await drive.use('s3').delete(`users/${oldAvatarUrl}`)
      }
      updateData.avatar = null
    } else if (data.avatar) {
      if (user.avatar) {
        const oldAvatarUrl = user.avatar.split('/').pop()
        await drive.use('s3').delete(`users/${oldAvatarUrl}`)
      }

      const fileName = `${uuid()}.${data.avatar.extname}`
      const fileBuffer = await readFile(data.avatar.tmpPath!)
      await drive.use('s3').put(`users/${fileName}`, fileBuffer, {
        contentType: data.avatar.type,
        visibility: 'public',
      })
      updateData.avatar = await drive.use('s3').getUrl(`users/${fileName}`)
    }

    user.merge(updateData)
    await user.save()

    const updatedUser = await User.find(id)

    return response.json(updatedUser)
  }

  /**
   * @delete
   * @summary Delete a user by id
   * @description Delete a user
   * @responseBody 200 - { "message": "User deleted successfully" }
   */
  public async delete({ request, response, auth, logger }: HttpContext) {
    const { id } = request.params()
    const user = await User.find(id)

    if (!user) {
      logger.warn('User not found')
      return response.notFound({ message: 'User not found' })
    }

    if (
      auth.user?.role === UserRole.ADMIN &&
      (user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN)
    ) {
      logger.warn('Not authorized to delete this user')
      return response.forbidden({ message: 'Not authorized to delete this user' })
    }

    if (user.id === auth.user?.id) {
      logger.warn('Not authorized to delete yourself')
      return response.forbidden({ message: 'Not authorized to delete yourself' })
    }

    if (user.avatar) {
      const oldAvatarUrl = user.avatar.split('/').pop()
      await drive.use('s3').delete(`users/${oldAvatarUrl}`)
    }

    await user.delete()
    return response.status(204)
  }

  /**
   * @updateMe
   * @summary Update the current user
   * @description Update the current user
   * @requestBody <updateUserValidator>
   * @responseBody 200 - <User>
   */
  public async updateMe({ request, response, auth, logger }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Not authenticated' })
    }

    const data = await request.validateUsing(updateUserValidator)
    const updateData: Partial<User> = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      email: data.email,
      password: data.password,
    }

    if (data.avatar) {
      if (user.avatar) {
        const oldAvatarUrl = user.avatar.split('/').pop()
        await drive.use('s3').delete(`users/${oldAvatarUrl}`)
        logger.info({ oldAvatarUrl }, 'Old avatar deleted')
      }

      const fileName = `${uuid()}.${data.avatar.extname}`
      const fileBuffer = await readFile(data.avatar.tmpPath!)
      await drive.use('s3').put(`users/${fileName}`, fileBuffer, {
        contentType: data.avatar.type,
        visibility: 'public',
      })
    }

    user.merge(updateData)
    await user.save()

    const updatedUser = await User.find(user.id)

    logger.info({ updatedUser }, 'User updated')

    return response.json(updatedUser)
  }

  /**
   * @stats
   * @summary Get user statistics
   * @description Get various statistics about users
   * @responseBody 200 - { "totalUsers": 10, "usersByRole": { "ADMIN": 1, "USER": 9 } }
   */
  public async stats({ response }: HttpContext) {
    const totalUsers = await User.query().count('* as total').first()
    const usersByRole = await User.query().select('role').count('* as count').groupBy('role')

    const roleStats = usersByRole.reduce(
      (acc, curr) => {
        acc[curr.role] = Number(curr.$extras.count)
        return acc
      },
      {} as Record<UserRole, number>
    )

    return response.json({
      totalUsers: Number(totalUsers?.$extras.total || 0),
      usersByRole: roleStats,
    })
  }
}
