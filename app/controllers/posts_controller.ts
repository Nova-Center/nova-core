import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import PostComment from '#models/post_comment'
import { createPostCommentValidator } from '#validators/create_post_comment'
import { v4 as uuid } from 'uuid'
import drive from '@adonisjs/drive/services/main'
import { readFile } from 'node:fs/promises'
import PostLike from '#models/post_like'
import CommentLike from '#models/comment_like'
import { NovaPointService } from '#services/nova_point_service'
import { UserRole } from '../types/user_role.enum.js'
import { NotificationService } from '#services/notification_service'
import { NotificationType } from '../types/notification.enum.js'

export default class PostsController {
  /**
   * @index
   * @description Get all posts with pagination
   * @paramQuery page - The page number - @type(number)
   * @paramQuery per_page - The number of posts per page - @type(number)
   * @requestBody <Post>
   * @responseBody 200 - <Post[]>.with(relations, comments.relations).exclude(user, post).paginated()
   */
  public async index({ request, response, logger }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)

    const posts = await Post.query()
      .preload('user')
      .preload('comments', (commentsQuery) => {
        commentsQuery.preload('likes')
      })
      .preload('likes')
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)

    logger.info(posts)
    return response.json(posts)
  }

  /**
   * @noPagination
   * @summary Get all posts without pagination
   * @description Get all posts without pagination
   * @responseBody 200 - <Post[]>
   */
  public async noPagination({ response }: HttpContext) {
    const posts = await Post.query()
      .preload('user')
      .preload('comments', (commentsQuery) => {
        commentsQuery.preload('likes')
      })
      .preload('likes')
      .orderBy('created_at', 'desc')

    return response.json(posts)
  }

  /**
   * @store
   * @description Create a new post
   * @requestBody <createPostValidator>
   * @responseBody 201 - <Post>
   */
  public async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized()
    }

    // Récupération du texte et du fichier
    const caption = request.input('content')
    const imageFile = request.file('image')

    // Création du post
    const post = new Post()
    post.userId = user.id
    post.content = caption

    if (imageFile) {
      const fileName = `${uuid()}.${imageFile.extname}`
      const buffer = await readFile(imageFile.tmpPath!)

      await drive.use('s3').put(`posts/${fileName}`, buffer, {
        contentType: imageFile.type,
        visibility: 'public',
      })

      post.image = await drive.use('s3').getUrl(`posts/${fileName}`)
    }

    await post.save()

    // Points bonus
    await NovaPointService.addPoints(
      user.id,
      'CREATE_POST',
      `Created post: ${caption.substring(0, 50)}...`
    )

    return response.created(post)
  }

  /**
   * @show
   * @description Get a post by id
   * @responseBody 200 - <Post>.with(relations, comments.relations).exclude(user, post)
   */
  public async show({ request, response }: HttpContext) {
    const { id } = request.params()
    const post = await Post.query()
      .where('id', id)
      .preload('comments', (commentsQuery) => {
        commentsQuery.preload('likes').preload('user')
      })
      .preload('likes')
      .first()

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    return response.json(post)
  }

  /**
   * @destroy
   * @description Delete a post by id
   * @requestBody <Post>
   * @responseBody 200 - <Post>
   */
  public async destroy({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const { id } = request.params()
    const post = await Post.find(id)

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    if (
      post.userId !== user.id &&
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.SUPERADMIN
    ) {
      return response.status(403).json({ message: 'You are not authorized to delete this post' })
    }

    if (post.image) {
      await drive.use('s3').delete(`posts/${post.image.split('/').pop()}`)
    }

    await post.delete()
    await PostLike.query().where('post_id', id).delete()
    await PostComment.query().where('post_id', id).delete()

    return response.json({ message: 'Post deleted' })
  }

  /**
   * @like
   * @summary Like a post by id
   * @description Like a post by id
   * @requestBody <Post>
   * @responseBody 200 - <Post>
   * @responseBody 400 - { 'message': 'Post already liked' }
   */
  public async like({ auth, request, response }: HttpContext) {
    const { id } = request.params()
    const post = await Post.find(id)

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    const user = auth.getUserOrFail()

    const existingLike = await PostLike.findBy({ postId: id, userId: user.id })

    if (existingLike) {
      return response.status(400).json({ message: 'Post already liked' })
    }

    await PostLike.create({ postId: id, userId: user.id })

    // Add points to post author for receiving a like
    await NovaPointService.addPoints(
      post.userId,
      'RECEIVE_LIKE',
      `Received like on post: ${post.content.substring(0, 50)}...`
    )

    // Add notification to post author
    await NotificationService.createNotification(
      post.userId,
      `${user.username} liked your post`,
      `${post.content.substring(0, 50).concat('...')} has been liked`,
      NotificationType.POST_LIKE
    )

    await post.save()
    return response.json(post)
  }

  /**
   * @unlike
   * @summary Unlike a post by id
   * @description Unlike a post by id
   * @requestBody <Post>
   * @responseBody 200 - <Post>
   * @responseBody 400 - { 'message': 'Post not liked' }
   */
  public async unlike({ auth, request, response }: HttpContext) {
    const { id } = request.params()
    const post = await Post.find(id)

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    const user = auth.getUserOrFail()

    const existingLike = await PostLike.findBy({ postId: id, userId: user.id })

    if (!existingLike) {
      return response.status(400).json({ message: 'Post is not liked' })
    }

    await existingLike.delete()

    return response.json(post)
  }

  /**
   * @removeLike
   * @summary Remove a like from a post by id
   * @description Remove a like from a post by id
   * @requestBody <Post>
   * @responseBody 200 - <Post>
   */
  public async removeLike({ request, response }: HttpContext) {
    const { postId, userId } = request.params()
    const post = await Post.find(postId)

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    const like = await PostLike.findBy({ postId: postId, userId: userId })

    if (!like) {
      return response.status(400).json({ message: 'Post is not liked' })
    }

    await like.delete()

    return response.json(post)
  }

  /**
   * @comment
   * @summary Comment on a post by id
   * @description Comment on a post by id
   * @requestBody <createPostCommentValidator>
   * @responseBody 201 - <Post>
   */
  public async comment({ auth, request, response, logger }: HttpContext) {
    const { id } = request.params()
    const payload = await createPostCommentValidator.validate(request.only(['content']))
    const content = payload.content

    logger.info({ id, content }, 'Commenting on post')

    const post = await Post.find(id)

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    const user = auth.getUserOrFail()

    const comment = await post.related('comments').create({
      content,
      userId: user.id,
    })

    // Add points for creating a comment
    await NovaPointService.addPoints(
      user.id,
      'CREATE_COMMENT',
      `Commented on post: ${post.content.substring(0, 50)}...`
    )

    // Add points to post author for receiving a comment
    await NovaPointService.addPoints(
      post.userId,
      'RECEIVE_COMMENT',
      `Received comment on post: ${post.content.substring(0, 50)}...`
    )

    // Add notification to post author
    await NotificationService.createNotification(
      post.userId,
      `${user.username} commented on your post`,
      `${content.substring(0, 50).concat('...')} has been commented`,
      NotificationType.POST_COMMENT
    )

    return response.json(comment)
  }

  /**
   * @deleteComment
   * @summary Delete a comment by id
   * @description Delete a comment by id
   * @requestBody <Post>
   * @responseBody 200 - <Post>
   */
  public async deleteComment({ auth, request, response }: HttpContext) {
    const { id, commentId } = request.params()

    const comment = await PostComment.findBy({ id: commentId, postId: id })

    if (!comment) {
      return response.status(404).json({ message: 'Comment not found' })
    }

    if (
      comment.userId !== auth.user?.id &&
      auth.user?.role !== UserRole.ADMIN &&
      auth.user?.role !== UserRole.SUPERADMIN
    ) {
      return response.status(403).json({ message: 'You are not authorized to delete this comment' })
    }

    await comment.delete()

    return response.json({ message: 'Comment deleted' })
  }

  /**
   * @likeComment
   * @summary Like a comment by id
   * @description Like a comment by id
   * @requestBody <Post>
   * @responseBody 200 - <Post>
   * @responseBody 400 - { 'message': 'Comment already liked' }
   */
  public async likeComment({ auth, request, response, logger }: HttpContext) {
    const { id, commentId } = request.params()

    logger.info({ id, commentId }, 'Liking comment')

    const post = await Post.find(id)

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    const comment = await PostComment.find(commentId)

    if (!comment) {
      return response.status(404).json({ message: 'Comment not found' })
    }

    const user = auth.getUserOrFail()

    const like = await CommentLike.findBy({ commentId: id, userId: user.id })

    if (like) {
      await like.delete()
    }

    // Add points to comment author for receiving a like
    await NovaPointService.addPoints(
      comment.userId,
      'RECEIVE_LIKE',
      `Received like on comment: ${comment.content.substring(0, 50)}...`
    )

    await CommentLike.create({ commentId: id, userId: user.id })

    // Add notification to comment author

    await NotificationService.createNotification(
      comment.userId,
      `${user.username} liked your comment`,
      `${comment.content.substring(0, 50).concat('...')} has been liked`,
      NotificationType.COMMENT_LIKE
    )

    return response.json(comment)
  }

  /**
   * @unlikeComment
   * @summary Unlike a comment by id
   * @description Unlike a comment by id
   * @requestBody <Post>
   * @responseBody 200 - <Post>
   * @responseBody 400 - { 'message': 'Comment not liked' }
   */
  public async unlikeComment({ auth, request, response }: HttpContext) {
    const { id } = request.params()
    const comment = await PostComment.find(id)

    if (!comment) {
      return response.status(404).json({ message: 'Comment not found' })
    }

    const user = auth.getUserOrFail()

    const like = await CommentLike.findBy({ commentId: id, userId: user.id })

    if (!like) {
      return response.status(400).json({ message: 'Comment not liked' })
    }

    await like.delete()

    return response.json(comment)
  }

  /**
   * @getComments
   * @summary Get comments by post id
   * @description Get comments by post id
   * @requestBody <Post>
   * @responseBody 200 - <Post>
   */
  public async getComments({ request, response }: HttpContext) {
    const { id } = request.params()
    const post = await Post.find(id)

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    const comments = await PostComment.query().where('post_id', id).preload('likes')

    return response.json(comments)
  }

  /**
   * @myPosts
   * @summary Get current user's posts
   * @description Get all posts created by the current user
   * @responseBody 200 - <Post[]>
   */
  public async myPosts({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const posts = await Post.query()
      .where('userId', user.id)
      .preload('comments', (commentsQuery) => {
        commentsQuery.preload('likes')
      })
      .preload('likes')
      .orderBy('createdAt', 'desc')

    return response.json(posts)
  }

  /**
   * @myLikes
   * @summary Get posts liked by current user
   * @description Get all posts that the current user has liked
   * @responseBody 200 - <Post[]>
   */
  public async myLikes({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const likedPosts = await Post.query()
      .whereHas('likes', (query) => {
        query.where('userId', user.id)
      })
      .preload('comments', (commentsQuery) => {
        commentsQuery.preload('likes')
      })
      .preload('likes')
      .orderBy('createdAt', 'desc')

    return response.json(likedPosts)
  }

  /**
   * @stats
   * @summary Get post statistics
   * @description Get various statistics about posts including total counts and most popular posts
   * @responseBody 200 - { "totalPosts": 5, "totalLikes": 10, "totalComments": 20, "mostLikedPosts": "Post", "mostCommentedPosts": "Post" }
   */
  public async stats({ response }: HttpContext) {
    const totalPosts = await Post.query().count('* as total').first()
    const totalLikes = await PostLike.query().count('* as total').first()
    const totalComments = await PostComment.query().count('* as total').first()

    const mostLikedPosts = await Post.query()
      .withCount('likes')
      .preload('likes')
      .preload('comments')
      .orderBy('likes_count', 'desc')
      .limit(5)

    const mostCommentedPosts = await Post.query()
      .withCount('comments')
      .preload('likes')
      .preload('comments')
      .orderBy('comments_count', 'desc')
      .limit(5)

    return response.json({
      totalPosts: totalPosts?.$extras.total || 0,
      totalLikes: totalLikes?.$extras.total || 0,
      totalComments: totalComments?.$extras.total || 0,
      mostLikedPosts,
      mostCommentedPosts,
    })
  }
}
