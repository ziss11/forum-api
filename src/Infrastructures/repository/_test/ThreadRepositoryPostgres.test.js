const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const AddedComments = require('../../../Domains/threads/entities/AddedComments')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const owner = 'user-123'
      const threadId = 'thread-123'
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })

      // Action
      const addedComment = threadRepositoryPostgres.verifyThreadAvailability(threadId)

      // Assert
      await expect(addedComment).rejects.toThrowError(NotFoundError)
    })
  })

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const owner = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })

      // Action
      const addedComment = threadRepositoryPostgres.verifyCommentAvailability(threadId, commentId)

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
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })

      // Action
      const result = threadRepositoryPostgres.verifyCommentOwner(commentId, 'user-321')

      // Assert
      await expect(result).rejects.toThrowError(AuthorizationError)
    })
  })

  describe('addThread function', () => {
    const owner = 'user-123'
    const threadId = 'thread-123'

    it('should add thread to database', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Title',
        body: 'Body'
      })
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })

      // Action
      await threadRepositoryPostgres.addThread(owner, newThread)

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(threadId, owner)
      expect(threads).toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Title',
        body: 'Body'
      })
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(owner, newThread)

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: threadId,
        title: 'Title',
        owner
      }))
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
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })

      // Action
      await threadRepositoryPostgres.addThreadCommentsById(owner, threadId, content)

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById(commentId)
      expect(comment).toHaveLength(1)
    })

    it('should return added comment correctly', async () => {
      // Arrange
      const content = 'content'
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })

      // Action
      const addedComment = await threadRepositoryPostgres.addThreadCommentsById(owner, threadId, content)

      // Assert
      expect(addedComment).toStrictEqual(new AddedComments({
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
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })

      // Action
      await threadRepositoryPostgres.deleteThreadComments(commentId)

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById(commentId)
      expect(comment[0].is_delete).toBeTruthy()
    })
  })

  describe('getThreadById', () => {
    const threadOwner = 'user-123'
    const commentOwner = 'user-321'
    const threadId = 'thread-123'
    const commentId = 'comment-123'
    const replyId = 'reply-123'

    it('should get thread by id and return thread detail correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: threadOwner, username: 'dicoding' })
      await UsersTableTestHelper.addUser({ id: commentOwner, username: 'john' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId, owner: commentOwner })
      await RepliesTableTestHelper.addReply({ id: replyId, owner: commentOwner, commentId })

      // Action
      const threadDetail = await threadRepositoryPostgres.getThreadById(threadId)

      // Assert
      expect(threadDetail.id).toEqual(threadId)
    })

    it('should change comment content into **komentar telah dihapus** if comment is deleted', async () => {
      // Arrange
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: threadOwner, username: 'dicoding' })
      await UsersTableTestHelper.addUser({ id: commentOwner, username: 'john' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId, owner: commentOwner })
      await RepliesTableTestHelper.addReply({ id: replyId, owner: commentOwner, commentId })
      await CommentsTableTestHelper.deleteComment(threadId, commentId)

      // Action
      const threadDetail = await threadRepositoryPostgres.getThreadById(threadId)

      // Assert
      const deletedComment = threadDetail.comments.find((comment) => comment.id === commentId)
      expect(deletedComment.content).toEqual('**komentar telah dihapus**')
    })

    it('should change reply content into **balasan telah dihapus** if reply is deleted', async () => {
      // Arrange
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: threadOwner, username: 'dicoding' })
      await UsersTableTestHelper.addUser({ id: commentOwner, username: 'john' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId, owner: commentOwner })
      await RepliesTableTestHelper.addReply({ id: replyId, owner: commentOwner, commentId })
      await RepliesTableTestHelper.deleteCommentReply(commentId, replyId)

      // Action
      const threadDetail = await threadRepositoryPostgres.getThreadById(threadId)

      // Assert
      const deletedReply = threadDetail.comments[0].replies.find((reply) => reply.id === replyId)
      expect(deletedReply.content).toEqual('**balasan telah dihapus**')
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
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId })

      // Action
      await threadRepositoryPostgres.addCommentsReply({ owner, commentId, content })

      // Assert
      const comment = await RepliesTableTestHelper.findReplyById(replyId)
      expect(comment).toHaveLength(1)
    })
  })
})
