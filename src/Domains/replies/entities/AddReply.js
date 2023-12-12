class AddReply {
    constructor(payload) {
        this._validatePayload(payload);

        this.owner = payload.owner;
        this.threadId = payload.threadId;
        this.commentId = payload.commentId;
        this.content = payload.content;
    }

    _validatePayload(payload) {
        const { owner, threadId, commentId, content } = payload;

        if (!owner || !threadId || !commentId || !content) {
            throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof owner !== 'string' ||
            typeof threadId !== 'string' ||
            typeof commentId !== 'string' ||
            typeof content !== 'string'
        ) {
            throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddReply;
