class GetThreadByIdUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (threadId) {
    return await this._threadRepository.getThreadById(threadId)
  }
}

module.exports = GetThreadByIdUseCase
