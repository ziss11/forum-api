class AddCommentsByIdUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (owner, threadId, content) {
    this._validatePayload({ owner, threadId, content })
    await this._threadRepository.verifyThreadAvailability(threadId)
    return this._threadRepository.addThreadCommentsById(owner, threadId, content)
  }

  _validatePayload (payload) {
    const { owner, threadId, content } = payload

    if (!content || !threadId || !owner) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT')
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddCommentsByIdUseCase
