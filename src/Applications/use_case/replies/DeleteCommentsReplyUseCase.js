class DeleteCommentsReplyUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (owner, threadId, commentId, replyId) {
    await Promise.all([
      this._threadRepository.verifyThreadAvailability(threadId),
      this._threadRepository.verifyCommentAvailability(commentId),
      this._threadRepository.verifyReplyOwner(commentId, replyId, owner)
    ])
    return await this._threadRepository.deleteCommentsReply(replyId)
  }
}

module.exports = DeleteCommentsReplyUseCase
