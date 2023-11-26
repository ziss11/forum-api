const AddReply = require('../../../Domains/threads/entities/AddReply')

class AddReplyUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const addReply = new AddReply(useCasePayload)
    await this._threadRepository.verifyThreadAvailability(addReply.threadId)
    await this._threadRepository.verifyCommentAvailability(addReply.threadId, addReply.commentId)
    return await this._threadRepository.addCommentsReply(addReply)
  }
}

module.exports = AddReplyUseCase
