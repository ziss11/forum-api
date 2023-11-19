/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async addComments ({
    id = 'comment-123', owner = 'user-123', threadId = 'thread-123', content = 'sebuah comment', date = '2021-08-08T07:22:33.555Z'
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, owner, threadId, content, date]
    }

    await pool.query(query)
  },

  async findCommentsById (id, threadId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2 AND owner = $3',
      values: [id, threadId, owner]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  }
}

module.exports = CommentsTableTestHelper
