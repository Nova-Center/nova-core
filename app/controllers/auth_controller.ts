import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { createAuthValidator } from '#validators/auth'
import { loginValidator } from '#validators/login'
import drive from '@adonisjs/drive/services/main'
import { readFile } from 'node:fs/promises'
import { v4 as uuid } from 'uuid'
import { UserRole } from '../types/user_role.enum.js'

export default class AuthController {
  /**
   * @store
   * @summary Register a new user
   * @description Register a new user
   * @requestBody <createAuthValidator>
   * @responseBody 201 - <User>
   * @responseBody 400 - Email already exists
   */
  public async store({ request, response, logger }: HttpContext) {
    const payload = await createAuthValidator.validate(
      request.only([
        'email',
        'password',
        'firstName',
        'lastName',
        'birthDate',
        'username',
        'avatar',
      ])
    )

    logger.info({ payload }, 'Trying to create user')

    if (await User.findBy('email', payload.email)) {
      logger.warn('Email already exists')
      return response.badRequest({ message: 'Email already exists' })
    }

    if (await User.findBy('username', payload.username)) {
      logger.warn('Username already exists')
      return response.badRequest({ message: 'Username already exists' })
    }

    const user = new User()

    if (payload.avatar) {
      const fileName = `${uuid()}.${payload.avatar.extname}`
      const fileBuffer = await readFile(payload.avatar.tmpPath!)
      await drive.use('s3').put(`users/${fileName}`, fileBuffer, {
        contentType: payload.avatar.type,
        visibility: 'public',
      })

      user.avatar = await drive.use('s3').getUrl(`users/${fileName}`)
      logger.info({ avatar: user.avatar }, 'Avatar uploaded')
    } else {
      user.avatar = null
    }

    user.fill({
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
      birthDate: payload.birthDate,
      username: payload.username,
      avatar: user.avatar,
      novaPoints: 0,
      role: UserRole.USER,
    })

    logger.info({ user }, 'User created')

    await user.save()
    return response.created(user)
  }

  /**
   * @login
   * @summary Login a user
   * @description Login a user
   * @requestBody <loginValidator>
   * @responseBody 200 - { "type": "bearer", "name": "null", "token": "oat_MTI.uIkd...", "abilities": [ "*" ], "lastUsedAt": "null", "expiresAt": "2025-06-13T20:10:19.021Z" }
   * @responseBody 401 - Invalid credentials
   * @responseBody 422 - Validation error
   */
  public async login({ request, auth, response, logger }: HttpContext) {
    const { email, password } = await loginValidator.validate(request.body())
    logger.info({ email, password }, 'Trying to login')

    const user = await User.findBy('email', email)
    if (!user) {
      logger.warn('Invalid credentials')
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    if (user.isBanned) {
      logger.warn({ userId: user.id }, 'Banned user attempted to login')
      return response.forbidden({
        message: 'Your account has been banned',
        reason: user.banReason,
      })
    }

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      logger.warn('Invalid credentials')
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const token = await auth.use('api').createToken(user)
    logger.info({ token }, 'Login successful')

    return {
      type: token.type,
      name: token.name,
      token: token.value!.release(),
      abilities: token.abilities,
      lastUsedAt: token.lastUsedAt,
      expiresAt: token.expiresAt,
      role: user.role,
    }
  }

  /**
   * @destroy
   * @summary Logout a user
   * @operationId logout
   * @description Logout a user with the OAT token on the header
   * @responseBody 200 - { "message": "Logged out" }
   */
  public async destroy({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.json({ message: 'Logged out' })
  }
}
