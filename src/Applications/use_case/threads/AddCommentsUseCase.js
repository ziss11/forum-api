class AddCommentsUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (owner, threadId, content) {
    await this._threadRepository.verifyThreadAvailability(threadId)
    return await this._threadRepository.addThreadCommentsById(owner, threadId, content)
  }
}

module.exports = AddCommentsUseCase
