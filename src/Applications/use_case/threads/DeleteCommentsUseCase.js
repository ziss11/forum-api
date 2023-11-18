class DeleteCommentsUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (owner, threadId) {
    return await this._threadRepository.deleteThreadComments(owner, threadId)
  }
}

module.exports = DeleteCommentsUseCase
