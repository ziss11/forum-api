const AddReply = require('../../../Domains/replies/entities/AddReply')

class AddCommentsReplyUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute (useCasePayload) {
    const addReply = new AddReply(useCasePayload)
    await this._threadRepository.verifyThreadAvailability(addReply.threadId)
    await this._commentRepository.verifyCommentAvailability(addReply.commentId)
    return await this._replyRepository.addCommentsReply({
      owner: addReply.owner,
      commentId: addReply.commentId,
      content: addReply.content
    })
  }
}

module.exports = AddCommentsReplyUseCase
