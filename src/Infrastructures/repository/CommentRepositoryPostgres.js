const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const Comment = require('../../Domains/comments/entities/Comment');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async getCommentByThreadId(threadId) {
        const query = {
            text: `SELECT comments.id, comments.content, comments.date, comments.is_delete, users.username 
      FROM comments LEFT JOIN users ON users.id = comments.owner WHERE thread_id = $1
      ORDER BY comments.date ASC`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        const comments = result.rows.map(
            (comment) =>
                new Comment({
                    ...comment,
                    isDelete: comment.is_delete,
                })
        );

        return comments;
    }

    async addThreadCommentsById(owner, threadId, content) {
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, owner, threadId, content, date, false],
        };

        const result = await this._pool.query(query);

        return new AddedComment(result.rows[0]);
    }

    async deleteThreadComments(commentId) {
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id, is_delete',
            values: [commentId],
        };

        await this._pool.query(query);
    }

    async verifyCommentAvailability(commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('comment tidak ditemukan');
        }

        return result.rows[0];
    }

    async verifyCommentOwner(commentId, owner) {
        const comment = await this.verifyCommentAvailability(commentId);

        if (owner !== comment.owner) {
            throw new AuthorizationError(
                'anda tidak berhak mengakses resource ini'
            );
        }

        return comment;
    }
}

module.exports = CommentRepositoryPostgres;
