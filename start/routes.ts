/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import { middleware } from './kernel.js'
import { UserRole } from '../app/types/user_role.enum.js'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const PostsController = () => import('#controllers/posts_controller')

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.scalar('/swagger')
})

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            // Auth routes
            router.post('/register', [AuthController, 'store'])
            router.post('/login', [AuthController, 'login'])
            router.post('/logout', [AuthController, 'destroy']).use(
              middleware.auth({
                guards: ['api'],
              })
            )
          })
          .prefix('/auth')

        router
          .group(() => {
            // Users routes
            router.get('/', [UsersController, 'index']).use(middleware.role(UserRole.ADMIN))
            router.get('/me', [UsersController, 'me'])
            router
              .get('/:id', [UsersController, 'show'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/users')

        router
          .group(() => {
            // Posts routes
            router.get('/', [PostsController, 'index'])
            router.post('/', [PostsController, 'store'])
            router.get('/:id', [PostsController, 'show']).use(middleware.validateNumericId())
            router.delete('/:id', [PostsController, 'destroy']).use(middleware.validateNumericId())
            router.post('/:id/like', [PostsController, 'like']).use(middleware.validateNumericId())
            router
              .post('/:id/unlike', [PostsController, 'unlike'])
              .use(middleware.validateNumericId())
            router
              .post('/:id/comments', [PostsController, 'comment'])
              .use(middleware.validateNumericId())
            router
              .post('/:id/comments/:commentId/like', [PostsController, 'likeComment'])
              .use(middleware.validateNumericId())
            router
              .post('/:id/comments/:commentId/unlike', [PostsController, 'unlikeComment'])
              .use(middleware.validateNumericId())
            router
              .get('/:id/comments', [PostsController, 'getComments'])
              .use(middleware.validateNumericId())
            router
              .delete('/:id/comments/:commentId', [PostsController, 'deleteComment'])
              .use(middleware.validateNumericId())
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/posts')
      })
      .prefix('/v1')
  })
  .prefix('/api')
