class DeleteCommentsUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (owner, threadId, commentId) {
    return await this._threadRepository.deleteThreadComments(owner, threadId, commentId)
  }
}

module.exports = DeleteCommentsUseCase
