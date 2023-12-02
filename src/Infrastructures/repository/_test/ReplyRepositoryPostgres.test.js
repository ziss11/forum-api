const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const pool = require('../../database/postgres/pool')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')

describe('ReplyRepository postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('getCommentsReplyByThreadId function', () => {
    const owner = 'user-123'
    const threadId = 'thread-123'
    const commentId = 'comment-123'
    const replyId = 'reply-123'

    it('should get comments reply by thread id correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => 123
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })
      await RepliesTableTestHelper.addReply({ id: replyId })

      // Action
      const result = await replyRepositoryPostgres.getCommentsReplyByThreadId(threadId)
      // Assert
      expect(result[0].id).toEqual(replyId)
      expect(result).toHaveLength(1)
    })
  })

  describe('verifyReplyOwner function', () => {
    const owner = 'user-123'
    const threadId = 'thread-123'
    const commentId = 'comment-123'
    const replyId = 'reply-123'

    it('should get comments reply by thread id correctly when user is owner', async () => {
      // Arrange
      const fakeIdGenerator = () => 123
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })
      await RepliesTableTestHelper.addReply({ id: replyId })

      // Action
      const addedReply = await replyRepositoryPostgres.verifyReplyOwner(commentId, replyId, owner)

      // Assert
      expect(addedReply).toBeDefined()
    })

    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const fakeIdGenerator = () => 123
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })

      // Action
      const addedReply = replyRepositoryPostgres.verifyReplyOwner(commentId, replyId, owner)

      // Assert
      await expect(addedReply).rejects.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError when user not owner', async () => {
      // Arrange
      const fakeIdGenerator = () => 123
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })
      await RepliesTableTestHelper.addReply({ id: replyId })

      // Action
      const result = replyRepositoryPostgres.verifyReplyOwner(commentId, replyId, 'user-321')

      // Assert
      await expect(result).rejects.toThrowError(AuthorizationError)
    })
  })

  describe('addCommentsReply', () => {
    const owner = 'user-123'
    const threadId = 'thread-123'
    const commentId = 'comment-123'
    const replyId = 'reply-123'

    it('should persist add reply comments and return added reply correctly', async () => {
      // Arrange
      const content = 'sebuah balasan'
      const fakeIdGenerator = () => 123
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })

      // Action
      await replyRepositoryPostgres.addCommentsReply({ owner, commentId, content })

      // Assert
      const comment = await RepliesTableTestHelper.findReplyById(replyId)
      expect(comment).toHaveLength(1)
    })
  })

  describe('deleteCommentsReply', () => {
    it('should delete comments reply from database', async () => {
      // Arrange
      const owner = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const replyId = 'reply-123'

      const fakeIdGenerator = () => 123
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })
      await RepliesTableTestHelper.addReply({ id: replyId })

      // Action
      await replyRepositoryPostgres.deleteCommentsReply(replyId)

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById(replyId)
      expect(reply[0].is_delete).toBeTruthy()
    })
  })
})
