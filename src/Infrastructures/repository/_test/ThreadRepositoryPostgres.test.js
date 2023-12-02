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
    it('should return thread correctly when thread is available', async () => {
      // Arrange
      const owner = 'user-123'
      const threadId = 'thread-123'
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: threadId })

      // Action
      const thread = await threadRepositoryPostgres.verifyThreadAvailability(threadId)

      // Assert
      expect(thread).toBeDefined()
    })

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const owner = 'user-123'
      const threadId = 'thread-123'
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' })

      // Action
      const thread = threadRepositoryPostgres.verifyThreadAvailability(threadId)

      // Assert
      await expect(thread).rejects.toThrowError(NotFoundError)
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

    it('should get thread by id and return thread detail correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: threadOwner, username: 'dicoding' })
      await UsersTableTestHelper.addUser({ id: commentOwner, username: 'john' })
      await ThreadsTableTestHelper.addThread({ id: threadId })

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

      // Action
      const result = threadRepositoryPostgres.getThreadById('thread-321')

      // Assert
      await expect(result).rejects.toThrowError(NotFoundError)
    })
  })
})
