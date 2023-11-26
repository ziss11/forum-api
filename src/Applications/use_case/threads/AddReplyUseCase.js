class AddReplyUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const { owner, threadId, commentId, content } = useCasePayload
    await this._threadRepository.verifyThreadAvailability(threadId)
    await this._threadRepository.verifyCommentAvailability(threadId, commentId)
    return await this._threadRepository.addCommentsReply({ owner, commentId, content })
  }
}

module.exports = AddReplyUseCase
