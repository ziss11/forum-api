const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail')
const Comment = require('../../Domains/comments/entities/Comment')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CommentReply = require('../../Domains/replies/entities/CommentReply')

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

  async getThreadById (threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date AS thread_date,
      thread_owner.username AS thread_owner_username, comments.id AS comment_id, comments.content,
      comments.date AS comment_date, comments.is_delete AS comment_is_delete,
      comment_owner.username AS comment_owner_username, replies.id AS reply_id, replies.content AS reply_content,
      replies.date AS reply_date, replies.is_delete AS reply_is_delete, reply_owner.username AS reply_owner_username FROM threads
      LEFT JOIN users AS thread_owner ON threads.owner = thread_owner.id
      LEFT JOIN comments ON threads.id = comments.thread_id
      LEFT JOIN users AS comment_owner ON comments.owner = comment_owner.id
      LEFT JOIN replies ON comments.id = replies.comment_id
      LEFT JOIN users AS reply_owner ON replies.owner = reply_owner.id
      WHERE threads.id = $1 ORDER BY comments.date ASC, replies.date ASC`,
      values: [threadId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }

    const threadInfo = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      body: result.rows[0].body,
      date: result.rows[0].thread_date,
      username: result.rows[0].thread_owner_username
    }

    const commentList = result.rows.reduce((acc, row) => {
      const commentId = row.comment_id

      const comment = acc.get(commentId) || {
        id: commentId,
        username: row.comment_owner_username,
        date: row.comment_date,
        content: row.comment_is_delete ? '**komentar telah dihapus**' : row.content,
        replies: []
      }
      acc.set(commentId, comment)

      if (row.reply_id) {
        const reply = new CommentReply({
          id: row.reply_id,
          username: row.reply_owner_username,
          date: row.reply_date,
          content: row.reply_is_delete ? '**balasan telah dihapus**' : row.reply_content
        })
        acc.get(commentId).replies.push(reply)
      }

      return acc
    }, new Map())

    const comments = [...commentList.values()].map(comment => new Comment(comment))

    return new ThreadDetail({ ...threadInfo, comments })
  }
}

module.exports = ThreadRepositoryPostgres
