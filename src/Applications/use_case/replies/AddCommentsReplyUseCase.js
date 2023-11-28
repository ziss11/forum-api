class AddCommentsReplyUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    this._validatePayload(useCasePayload)
    const { owner, threadId, commentId, content } = useCasePayload
    await this._threadRepository.verifyThreadAvailability(threadId)
    await this._threadRepository.verifyCommentAvailability(commentId)
    return await this._threadRepository.addCommentsReply({ owner, commentId, content })
  }

  _validatePayload (payload) {
    const { content } = payload

    if (!content) {
      throw new Error('ADD_COMMENTS_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENTS_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddCommentsReplyUseCase
