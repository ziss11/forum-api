const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentsUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const addComment = new AddComment(useCasePayload);
        await this._threadRepository.verifyThreadAvailability(
            addComment.threadId
        );
        return await this._commentRepository.addThreadCommentsById(
            addComment.owner,
            addComment.threadId,
            addComment.content
        );
    }
}

module.exports = AddCommentsUseCase;
