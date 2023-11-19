const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const AddedComments = require('../../Domains/threads/entities/AddedComments')
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail')
const Comment = require('../../Domains/threads/entities/Comment')

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

  async getThreadById (owner, threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date AS thread_date,
      thread_owner.username AS thread_owner_username, comments.id AS comment_id, comments.content,
      comments.date AS comment_date, comment_owner.username AS comment_owner_username FROM threads
      LEFT JOIN users AS thread_owner ON threads.owner = thread_owner.id
      LEFT JOIN comments ON threads.id = comments.thread_id
      LEFT JOIN users AS comment_owner ON comments.owner = comment_owner.id
      WHERE threads.id = $1 AND threads.owner = $2;`,
      values: [threadId, owner]
    }

    const result = await this._pool.query(query)
    const { id, title, body, thread_owner_username: username, thread_date: date } = result.rows[0]
    const comments = result.rows.map((comment) => new Comment({
      id: comment.comment_id,
      username: comment.comment_owner_username,
      date: comment.comment_date,
      content: comment.content
    }))
    return new ThreadDetail({ id, title, body, date, username, comments })
  }
}

module.exports = ThreadRepositoryPostgres
