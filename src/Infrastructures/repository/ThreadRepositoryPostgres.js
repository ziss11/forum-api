const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const AddedComments = require('../../Domains/threads/entities/AddedComments')
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail')
const Comment = require('../../Domains/threads/entities/Comment')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const AddedReply = require('../../Domains/threads/entities/AddedReply')
const CommentReply = require('../../Domains/threads/entities/CommentReply')

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

  async verifyCommentAvailability (commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan')
    }

    return result.rows[0]
  }

  async verifyCommentOwner (commentId, owner) {
    const comment = await this.verifyCommentAvailability(commentId)

    if (owner !== comment.owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini')
    }
  }

  async verifyReplyOwner (commentId, replyId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND comment_id = $2',
      values: [replyId, commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan')
    }

    const reply = result.rows[0]

    if (owner !== reply.owner) {
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
    const id = `comment-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, owner, threadId, content, date, false]
    }

    const result = await this._pool.query(query)

    return new AddedComments({ ...result.rows[0] })
  }

  async deleteThreadComments (commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id, is_delete',
      values: [commentId]
    }

    await this._pool.query(query)
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

  async addCommentsReply (payload) {
    const { owner, commentId, content } = payload

    const id = `reply-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, owner, commentId, content, date, false]
    }

    const result = await this._pool.query(query)

    return new AddedReply({ ...result.rows[0] })
  }

  async deleteCommentsReply (replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id, is_delete',
      values: [replyId]
    }

    await this._pool.query(query)
  }
}

module.exports = ThreadRepositoryPostgres
