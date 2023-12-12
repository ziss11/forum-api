const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async verifyThreadAvailability(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        return result.rows[0];
    }

    async addThread(owner, newThread) {
        const { title, body } = newThread;
        const id = `thread-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, owner, title, body, date],
        };

        const result = await this._pool.query(query);
        return new AddedThread({ ...result.rows[0] });
    }

    async getThreadById(threadId) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
      FROM threads LEFT JOIN users ON threads.owner = users.id
      WHERE threads.id = $1 ORDER BY threads.date ASC`,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        return new ThreadDetail(result.rows[0]);
    }
}

module.exports = ThreadRepositoryPostgres;
