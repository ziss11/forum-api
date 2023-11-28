const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ReplyRepository = require('../../Domains/replies/ReplyRepository')
const AddedReply = require('../../Domains/replies/entities/AddedReply')
const CommentReply = require('../../Domains/replies/entities/CommentReply')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async getCommentsReplyByThreadId (threadId) {
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, replies.is_delete, replies.comment_id, 
      users.username FROM replies LEFT JOIN users ON users.id = replies.owner WHERE thread_id = $1
      ORDER BY replies.date ASC`,
      values: [threadId]
    }

    const result = await this._pool.query(query)
    const replies = result.rows.map(reply => new CommentReply({
      ...reply, isDelete: reply.is_delete, commentId: reply.comment_id
    }))
    return replies
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

  async addCommentsReply (payload) {
    const { owner, threadId, commentId, content } = payload

    const id = `reply-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, owner, commentId, content, date, false, threadId]
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

module.exports = ReplyRepositoryPostgres
