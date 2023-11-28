/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const RepliesTableTestHelper = {
  async addReply ({
    id = 'reply-123', owner = 'user-123', threadId = 'thread-123', commentId = 'comment-123', content = 'sebuah balasan', date = '2021-08-08T07:22:33.555Z'
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, owner, commentId, content, date, false, threadId]
    }

    await pool.query(query)
  },

  async findReplyById (id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async deleteCommentReply (commentId, replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1 AND comment_id = $2',
      values: [replyId, commentId]
    }

    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('DELETE FROM replies WHERE 1=1')
  }
}

module.exports = RepliesTableTestHelper
