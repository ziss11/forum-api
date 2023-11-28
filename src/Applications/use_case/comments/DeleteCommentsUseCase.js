class DeleteCommentsUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (owner, threadId, commentId) {
    await Promise.all([
      this._threadRepository.verifyThreadAvailability(threadId),
      this._threadRepository.verifyCommentOwner(commentId, owner)
    ])
    return await this._threadRepository.deleteThreadComments(commentId)
  }
}

module.exports = DeleteCommentsUseCase
