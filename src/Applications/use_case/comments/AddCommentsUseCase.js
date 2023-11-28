class AddCommentsUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    this._validatePayload(useCasePayload)
    const { owner, threadId, content } = useCasePayload
    await this._threadRepository.verifyThreadAvailability(threadId)
    return await this._threadRepository.addThreadCommentsById(owner, threadId, content)
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

module.exports = AddCommentsUseCase
