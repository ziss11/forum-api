const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const AddedComments = require('../../Domains/threads/entities/AddedComments')
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail')
const Comment = require('../../Domains/threads/entities/Comment')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async verifyThreadAvailability (threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }
  }

  async verifyCommentOwner (commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan')
    }

    const comment = result.rows[0]

    if (owner !== comment.owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini')
    }
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
    await this.verifyThreadAvailability(threadId)

    const id = `comment-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, owner, threadId, content, date, false]
    }

    const result = await this._pool.query(query)

    return new AddedComments({ ...result.rows[0] })
  }

  async deleteThreadComments (owner, threadId, commentId) {
    await this.verifyThreadAvailability(threadId)
    await this.verifyCommentOwner(commentId, owner)

    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId]
    }

    await this._pool.query(query)
  }

  async getThreadById (threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date AS thread_date,
      thread_owner.username AS thread_owner_username, comments.id AS comment_id, comments.content,
      comments.date AS comment_date, comments.is_delete AS comment_is_delete, comment_owner.username AS comment_owner_username FROM threads
      LEFT JOIN users AS thread_owner ON threads.owner = thread_owner.id
      LEFT JOIN comments ON threads.id = comments.thread_id
      LEFT JOIN users AS comment_owner ON comments.owner = comment_owner.id
      WHERE threads.id = $1 ORDER BY comments.date ASC`,
      values: [threadId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }

    const { id, title, body, thread_owner_username: username, thread_date: date } = result.rows[0]
    const comments = result.rows.map((comment) => new Comment({
      id: comment.comment_id,
      username: comment.comment_owner_username,
      date: comment.comment_date,
      content: comment.comment_is_delete ? '**komentar telah dihapus**' : comment.content
    }))

    return new ThreadDetail({ id, title, body, date, username, comments })
  }
}

module.exports = ThreadRepositoryPostgres
