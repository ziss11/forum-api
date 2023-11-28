const AddComment = require('../../../Domains/comments/entities/AddComment')

class AddCommentsUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const addComment = new AddComment(useCasePayload)
    await this._threadRepository.verifyThreadAvailability(addComment.threadId)
    return await this._threadRepository.addThreadCommentsById(addComment.owner, addComment.threadId, addComment.content)
  }
}

module.exports = AddCommentsUseCase
