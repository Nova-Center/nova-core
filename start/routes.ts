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
const EventsController = () => import('#controllers/events_controller')
const NewsController = () => import('#controllers/news_controller')
const ServicesController = () => import('#controllers/services_controller')
const ShopItemsController = () => import('#controllers/shop_items_controller')
const NotificationsController = () => import('#controllers/notifications_controller')
const PrivateMessagesController = () => import('#controllers/private_messages_controller')

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
            router.get('/', [UsersController, 'index']).use(middleware.role(UserRole.ADMIN))
            router.get('/no-pagination', [UsersController, 'usersWithoutPagination'])
            router.get('/all', [UsersController, 'getUsers'])
            router.get('/stats', [UsersController, 'stats']).use(middleware.role(UserRole.ADMIN))
            router.get('/:id', [UsersController, 'show']).use(middleware.validateNumericId())
            router
              .patch('/:id', [UsersController, 'update'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
            router
              .delete('/:id', [UsersController, 'delete'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
            router
              .post('/:id/ban', [BansController, 'ban'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
            router
              .post('/:id/unban', [BansController, 'unban'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/users')

        // Posts routes
        router
          .group(() => {
            router.get('/', [PostsController, 'index'])
            router.get('/no-pagination', [PostsController, 'noPagination'])
            router.get('/stats', [PostsController, 'stats']).use(middleware.role(UserRole.ADMIN))
            router.post('/', [PostsController, 'store'])
            router.get('/:id', [PostsController, 'show']).use(middleware.validateNumericId())
            router.delete('/:id', [PostsController, 'destroy']).use(middleware.validateNumericId())
            router.post('/:id/like', [PostsController, 'like']).use(middleware.validateNumericId())
            router
              .post('/:id/unlike', [PostsController, 'unlike'])
              .use(middleware.validateNumericId())
            router
              .post('/:postId/unlike/:userId', [PostsController, 'removeLike'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
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

        // Events routes
        router
          .group(() => {
            router.get('/', [EventsController, 'index'])
            router.get('/no-pagination', [EventsController, 'noPagination'])
            router.get('/stats', [EventsController, 'stats'])
            router.get('/:id', [EventsController, 'show']).use(middleware.validateNumericId())
            router.post('/', [EventsController, 'store'])
            router.delete('/:id', [EventsController, 'destroy']).use(middleware.validateNumericId())
            router
              .post('/:id/subscribe', [EventsController, 'subscribe'])
              .use(middleware.validateNumericId())
            router
              .post('/:id/unsubscribe', [EventsController, 'unsubscribe'])
              .use(middleware.validateNumericId())
            router
              .post('/:eventId/unsubscribe/:userId', [EventsController, 'unsubscribeByAdmin'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/events')

        // News routes
        router
          .group(() => {
            router.get('/', [NewsController, 'index'])
            router.post('/', [NewsController, 'store']).use(middleware.role(UserRole.ADMIN))
            router.get('/:id', [NewsController, 'show']).use(middleware.validateNumericId())
            router
              .patch('/:id', [NewsController, 'update'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
            router
              .delete('/:id', [NewsController, 'destroy'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/news')

        // Services routes
        router
          .group(() => {
            router.get('/', [ServicesController, 'index'])
            router.get('/no-pagination', [ServicesController, 'noPagination'])
            router.post('/', [ServicesController, 'store'])
            router.get('/:id', [ServicesController, 'show']).use(middleware.validateNumericId())
            router
              .delete('/:id', [ServicesController, 'destroy'])
              .use(middleware.validateNumericId())
            router
              .post('/:id/volunteer', [ServicesController, 'volunteer'])
              .use(middleware.validateNumericId())
            router
              .post('/:id/unvolunteer', [ServicesController, 'unvolunteer'])
              .use(middleware.validateNumericId())
            router
              .post('/:id/propose-exchange', [ServicesController, 'proposeExchange'])
              .use(middleware.validateNumericId())
            router
              .post('/:id/accept-exchange', [ServicesController, 'acceptExchange'])
              .use(middleware.validateNumericId())
            router
              .post('/:id/cancel-exchange', [ServicesController, 'cancelExchange'])
              .use(middleware.validateNumericId())
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/services')

        // Shop items routes
        router
          .group(() => {
            router.get('/', [ShopItemsController, 'index'])
            router.get('/no-pagination', [ShopItemsController, 'noPagination'])
            router.post('/', [ShopItemsController, 'store']).use(middleware.role(UserRole.ADMIN))
            router.get('/:id', [ShopItemsController, 'show']).use(middleware.validateNumericId())
            router
              .delete('/:id', [ShopItemsController, 'destroy'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
            router
              .patch('/:id', [ShopItemsController, 'update'])
              .use(middleware.validateNumericId())
              .use(middleware.role(UserRole.ADMIN))
            router
              .post('/:id/purchase', [ShopItemsController, 'purchase'])
              .use(middleware.validateNumericId())
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/shop-items')

        // Notifications routes
        router
          .group(() => {
            router.get('/', [NotificationsController, 'index'])
            router.get('/no-pagination', [NotificationsController, 'noPagination'])
            router
              .post('/:id/read', [NotificationsController, 'read'])
              .use(middleware.validateNumericId())
            router.post('/read-all', [NotificationsController, 'readAll'])
            router.get('/numbers-of-notifications', [
              NotificationsController,
              'numbersOfNotifications',
            ])
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/notifications')

        // Private Messages routes
        router
          .group(() => {
            router
              .get('/conversation/:otherUserId', [PrivateMessagesController, 'getConversation'])
              .use(middleware.validateNumericId())
            router.get('/last-messages', [PrivateMessagesController, 'getAllLastMessages'])
            router
              .post('/mark-as-read/:senderId', [PrivateMessagesController, 'markAsRead'])
              .use(middleware.validateNumericId())
            router.get('/unread-count', [PrivateMessagesController, 'getUnreadCount'])
          })
          .middleware(middleware.auth({ guards: ['api'] }))
          .prefix('/messages')
      })
      .prefix('/v1')
  })
  .prefix('/api')
