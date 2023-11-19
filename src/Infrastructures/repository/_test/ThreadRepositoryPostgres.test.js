const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const pool = require('../../database/postgres/pool')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    it('should add thread to database', async () => {
      // Arrange
      const owner = 'user-123'
      const newThread = new NewThread({
        title: 'Title',
        body: 'Body'
      })
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' })

      // Action
      await threadRepositoryPostgres.addThread(owner, newThread)

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')
      expect(threads).toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Arrange
      const owner = 'user-123'
      const newThread = new NewThread({
        title: 'Title',
        body: 'Body'
      })
      const fakeIdGenerator = () => 123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' })

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(owner, newThread)

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Title',
        owner: 'user-123'
      }))
    })
  })
})
