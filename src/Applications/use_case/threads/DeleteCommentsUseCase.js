class DeleteCommentsUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (owner, threadId, commentId) {
    await this._threadRepository.verifyThreadAvailability(threadId)
    await this._threadRepository.verifyCommentOwner(commentId, owner)
    return await this._threadRepository.deleteThreadComments(owner, threadId, commentId)
  }
}

module.exports = DeleteCommentsUseCase
