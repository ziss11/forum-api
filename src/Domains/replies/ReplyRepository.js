class ReplyRepository {
  async verifyReplyOwner (commentId, owner) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async addCommentsReply (owner, commentId, content) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteCommentsReply (owner, threadId, commentId, replyId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ReplyRepository
