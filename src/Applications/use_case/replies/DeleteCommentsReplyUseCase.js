class DeleteCommentsReplyUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute (owner, threadId, commentId, replyId) {
    await Promise.all([
      this._threadRepository.verifyThreadAvailability(threadId),
      this._commentRepository.verifyCommentAvailability(commentId),
      this._replyRepository.verifyReplyOwner(commentId, replyId, owner)
    ])
    return await this._replyRepository.deleteCommentsReply(replyId)
  }
}

module.exports = DeleteCommentsReplyUseCase
