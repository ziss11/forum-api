class AddedComment {
    constructor(payload) {
        this._validatePayload(payload);

        this.id = payload.id;
        this.content = payload.content;
        this.owner = payload.owner;
    }

    _validatePayload(payload) {
        const { id, content, owner } = payload;

        if (!id || !content || !owner) {
            throw new Error('ADDED_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof content !== 'string' ||
            typeof owner !== 'string'
        ) {
            throw new Error('ADDED_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddedComment;
