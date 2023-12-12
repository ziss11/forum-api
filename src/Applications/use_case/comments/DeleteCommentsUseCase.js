class DeleteCommentsUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(owner, threadId, commentId) {
        await Promise.all([
            this._threadRepository.verifyThreadAvailability(threadId),
            this._commentRepository.verifyCommentOwner(commentId, owner),
        ]);
        return await this._commentRepository.deleteThreadComments(commentId);
    }
}

module.exports = DeleteCommentsUseCase;
