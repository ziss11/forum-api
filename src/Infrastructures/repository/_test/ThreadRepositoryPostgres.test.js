const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const pool = require('../../database/postgres/pool')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const AddedComments = require('../../../Domains/threads/entities/AddedComments')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
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

    it('shoud throw NotFoundError when thread not found', async () => {
      // Arrange
      const content = 'content'
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })

      // Action
      const addedComment = threadRepositoryPostgres.addThreadCommentsById(owner, threadId, content)

      // Assert
      expect(addedComment).rejects.toThrowError(NotFoundError)
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
      await threadRepositoryPostgres.deleteThreadComments(owner, threadId, commentId)

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById(commentId, threadId, owner)
      expect(comment).toHaveLength(0)
    })
  })

  describe('getThreadById', () => {
    const threadOwner = 'user-123'
    const commentOwner = 'user-321'
    const threadId = 'thread-123'
    const commentId = 'comment-123'

    it('should get thread by id and return thread detail correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: threadOwner, username: 'dicoding' })
      await UsersTableTestHelper.addUser({ id: commentOwner, username: 'john' })
      await ThreadsTableTestHelper.addThread({ id: threadId })
      await CommentsTableTestHelper.addComments({ id: commentId, owner: commentOwner })

      // Action
      await threadRepositoryPostgres.getThreadById(threadOwner, threadId)

      // Assert
      const threadDetail = await ThreadsTableTestHelper.findThreadsById(threadId, threadOwner)
      expect(threadDetail).toHaveLength(1)
    })
  })
})
