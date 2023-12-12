/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-123',
        owner = 'user-123',
        title = 'sebuah thread',
        body = 'sebuah body thread',
        date = '2021-08-08T07:19:09.775Z',
    }) {
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
            values: [id, owner, title, body, date],
        };

        await pool.query(query);
    },

    async findThreadsById(id) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
      FROM threads LEFT JOIN users ON threads.owner = users.id
      WHERE threads.id = $1 ORDER BY threads.date ASC`,
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    },
};

module.exports = ThreadsTableTestHelper;
