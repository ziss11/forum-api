class AddCommentsByIdUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (owner, threadId, content) {
    this._validatePayload(content)
    return this._threadRepository.addThreadCommentsById(owner, threadId, content)
  }

  _validatePayload (content) {
    if (!content) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT')
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddCommentsByIdUseCase
