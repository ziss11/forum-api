class AddCommentsByIdUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (owner, threadId, content) {
    return this._threadRepository.addThreadCommentsById(owner, threadId, content)
  }
}

module.exports = AddCommentsByIdUseCase
