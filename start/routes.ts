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
const BansController = () => import('#controllers/bans_controller')
const NovaPointsController = () => import('#controllers/nova_points_controller')

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

        // Me routes - Personal user data
        router
          .group(() => {
            router.get('/', [UsersController, 'me'])
            router.patch('/', [UsersController, 'updateMe'])
            router.get('/nova-points', [NovaPointsController, 'total'])
            router.get('/nova-points/history', [NovaPointsController, 'history'])
            router.get('/posts', [PostsController, 'myPosts'])
            router.get('/likes', [PostsController, 'myLikes'])
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/me')

        // Users routes - Admin only
        router
          .group(() => {
            router.get('/', [UsersController, 'index'])
            router.get('/stats', [UsersController, 'stats'])
            router.get('/:id', [UsersController, 'show']).use(middleware.validateNumericId())
            router.patch('/:id', [UsersController, 'update']).use(middleware.validateNumericId())
            router.delete('/:id', [UsersController, 'delete']).use(middleware.validateNumericId())
            router.post('/:id/ban', [BansController, 'ban']).use(middleware.validateNumericId())
            router.post('/:id/unban', [BansController, 'unban']).use(middleware.validateNumericId())
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .middleware(middleware.role(UserRole.ADMIN))
          .prefix('/users')

        // Posts routes
        router
          .group(() => {
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

        // NovaPoints routes
        router
          .group(() => {
            router.get('/leaderboard', [NovaPointsController, 'leaderboard'])
            router.get('/stats', [NovaPointsController, 'stats'])
            router.get('/history/:id', [NovaPointsController, 'historyById'])
            router
              .post('/:id/add', [NovaPointsController, 'addPoints'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
            router
              .post('/:id/remove', [NovaPointsController, 'remove'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/nova-points')
      })
      .prefix('/v1')
  })
  .prefix('/api')
