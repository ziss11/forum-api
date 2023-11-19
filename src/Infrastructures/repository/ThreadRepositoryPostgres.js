const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const AddedComments = require('../../Domains/threads/entities/AddedComments')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread (owner, newThread) {
    const { title, body } = newThread
    const id = `thread-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, owner, title, body, date]
    }

    const result = await this._pool.query(query)
    return new AddedThread({ ...result.rows[0] })
  }

  async addThreadCommentsById (owner, threadId, content) {
    const id = `comment-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, owner, threadId, content, date]
    }

    const result = await this._pool.query(query)
    return new AddedComments({ ...result.rows[0] })
  }

  async deleteThreadComments (owner, threadId, commentId) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1 AND owner = $2 AND thread_id = $3',
      values: [commentId, owner, threadId]
    }

    await this._pool.query(query)
  }

  async getThreadById (owner, threadId) {}
}

module.exports = ThreadRepositoryPostgres
