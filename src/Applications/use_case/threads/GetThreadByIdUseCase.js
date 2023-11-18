class GetThreadByIdUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (owner, threadId) {
    return await this._threadRepository.getThreadById(owner, threadId)
  }
}

module.exports = GetThreadByIdUseCase
