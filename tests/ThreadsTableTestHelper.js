/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
  async addThread ({
    id = 'thread-123',
    owner = 'user-123',
    title = 'sebuah thread',
    body = 'sebuah body thread',
    date = '2021-08-08T07:19:09.775Z'
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, owner, title, body, date]
    }

    await pool.query(query)
  },

  async findThreadsById (id, owner) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date AS thread_date,
      thread_owner.username AS thread_owner_username, comments.id AS comment_id, comments.content,
      comments.date AS comment_date, comment_owner.username AS comment_owner_username FROM threads
      LEFT JOIN users AS thread_owner ON threads.owner = thread_owner.id
      LEFT JOIN comments ON threads.id = comments.thread_id
      LEFT JOIN users AS comment_owner ON comments.owner = comment_owner.id
      WHERE threads.id = $1 AND threads.owner = $2;`,
      values: [id, owner]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM threads WHERE 1=1')
  }
}

module.exports = ThreadsTableTestHelper
