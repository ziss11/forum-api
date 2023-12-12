class CommentReply {
    constructor(payload) {
        this._validatePayload(payload);

        this.id = payload.id;
        this.username = payload.username;
        this.date = payload.date;
        this.content = payload.content;
        this.commentId = payload.commentId;
        this.isDelete = payload.isDelete;
    }

    _validatePayload(payload) {
        const { id, username, date, content } = payload;

        if (!id || !username || !date || !content) {
            throw new Error('COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof username !== 'string' ||
            typeof date !== 'string' ||
            typeof content !== 'string'
        ) {
            throw new Error('COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentReply;
