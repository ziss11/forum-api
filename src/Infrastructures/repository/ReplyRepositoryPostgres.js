const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ReplyRepository = require('../../Domains/replies/ReplyRepository')
const AddedReply = require('../../Domains/replies/entities/AddedReply')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
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

module.exports = ReplyRepositoryPostgres
