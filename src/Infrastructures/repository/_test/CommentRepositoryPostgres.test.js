const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepository postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('getCommentByThreadId function', () => {
    const owner = 'user-123'
    const threadId = 'thread-123'
    const commentId = 'comment-123'

    it('should get comments reply by thread id correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => 123
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })

      // Action
      const result = await commentRepositoryPostgres.getCommentByThreadId(threadId)

      // Assert
      expect(result[0].id).toEqual(commentId)
      expect(result).toHaveLength(1)
    })
  })

  describe('addThreadCommentsById', () => {
    const owner = 'user-123'
    const threadId = 'thread-123'
    const commentId = 'comment-123'

    it('should persist add thread comments and return added comment correctly', async () => {
      // Arrange
      const content = 'content'
      const fakeIdGenerator = () => 123
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })

      // Action
      await commentRepositoryPostgres.addThreadCommentsById(owner, threadId, content)

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById(commentId)
      expect(comment).toHaveLength(1)
    })

    it('should return added comment correctly', async () => {
      // Arrange
      const content = 'content'
      const fakeIdGenerator = () => 123
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })

      // Action
      const addedComment = await commentRepositoryPostgres.addThreadCommentsById(owner, threadId, content)

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content,
        owner
      }))
    })
  })

  describe('deleteThreadComments', () => {
    it('should delete thread comments from database', async () => {
      // Arrange
      const owner = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const fakeIdGenerator = () => 123
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })

      // Action
      await commentRepositoryPostgres.deleteThreadComments(commentId)

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById(commentId)
      expect(comment[0].is_delete).toBeTruthy()
    })
  })

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const owner = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const fakeIdGenerator = () => 123
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })

      // Action
      const addedComment = commentRepositoryPostgres.verifyCommentAvailability(threadId, commentId)

      // Assert
      await expect(addedComment).rejects.toThrowError(NotFoundError)
    })
  })

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user not owner', async () => {
      // Arrange
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const fakeIdGenerator = () => 123
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })

      // Action
      const result = commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-321')

      // Assert
      await expect(result).rejects.toThrowError(AuthorizationError)
    })
  })
})
