const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
  async addThread ({
    id = 'thread-123',
    title = 'sebuah thread',
    body = 'sebuah body thread',
    date = '2021-08-08T07:19:09.775Z',
    username = 'dicoding',
    comments = []
  }) {
    const query = {
      text: 'INSERT into threads VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, title, body, date, username, comments]
    }

    await pool.query(query)
  },

  async findThreadsById (id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM threads WHERE 1=1')
  }
}

module.exports = ThreadsTableTestHelper
