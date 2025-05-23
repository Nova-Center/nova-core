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

export default class PostsController {
  /**
   * @index
   * @description Get all posts
   * @requestBody <Post>
   * @responseBody 200 - <Post[]>.with(relations, comments.relations).exclude(user, post)
   */
  public async index({ response, logger }: HttpContext) {
    const posts = await Post.query()
      .preload('comments', (commentsQuery) => {
        commentsQuery.preload('likes')
      })
      .preload('likes')
    logger.info(posts)
    return response.json(posts)
  }

  /**
   * @store
   * @description Create a new post
   * @requestBody <createPostValidator>
   * @responseBody 201 - <Post>
   */
  public async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = request.body()

    const post = await Post.create({
      ...data,
      userId: user.id,
    })

    // Add points for creating a post
    await NovaPointService.addPoints(
      user.id,
      'CREATE_POST',
      `Created post: ${post.content.substring(0, 50)}...`
    )

    if (post.image) {
      const fileName = `${uuid()}.${post.image.split('.').pop()}`
      const fileBuffer = await readFile(post.image)
      await drive.use('s3').put(`posts/${fileName}`, fileBuffer, {
        contentType: post.image.split('.').pop(),
        visibility: 'public',
      })

      post.image = await drive.use('s3').getUrl(`posts/${fileName}`)
    }

    await post.save()
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
        commentsQuery.preload('likes')
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

    if (post.userId !== user.id) {
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

    if (comment.userId !== auth.user?.id) {
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

    await CommentLike.create({ commentId: id, userId: user.id })

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
}
