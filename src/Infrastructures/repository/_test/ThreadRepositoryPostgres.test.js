const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
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

    it('should throw NotFound Error when thread not found', async () => {
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: threadOwner, username: 'dicoding' })
      await UsersTableTestHelper.addUser({ id: commentOwner, username: 'john' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId, owner: commentOwner })
      await RepliesTableTestHelper.addReply({ id: replyId, owner: commentOwner, commentId })
      await CommentsTableTestHelper.deleteComment(threadId, commentId)

      // Action
      const result = threadRepositoryPostgres.getThreadById('thread-321')

      // Assert
      await expect(result).rejects.toThrowError(NotFoundError)
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
})
