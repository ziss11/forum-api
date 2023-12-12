class AddComment {
    constructor(payload) {
        this._validatePaylod(payload);

        this.owner = payload.owner;
        this.threadId = payload.threadId;
        this.content = payload.content;
    }

    _validatePaylod(payload) {
        const { owner, threadId, content } = payload;

        if (!owner || !threadId || !content) {
            throw new Error('ADD_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof owner !== 'string' ||
            typeof threadId !== 'string' ||
            typeof content !== 'string'
        ) {
            throw new Error('ADD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddComment;
