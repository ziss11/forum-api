const AddReply = require('../../../Domains/replies/entities/AddReply')

class AddCommentsReplyUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const addReply = new AddReply(useCasePayload)
    await this._threadRepository.verifyThreadAvailability(addReply.threadId)
    await this._threadRepository.verifyCommentAvailability(addReply.commentId)
    return await this._threadRepository.addCommentsReply({
      owner: addReply.owner,
      commentId: addReply.commentId,
      content: addReply.content
    })
  }
}

module.exports = AddCommentsReplyUseCase
