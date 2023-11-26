class ThreadRepository {
  async addThread (owner, newThread) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async addThreadCommentsById (owner, threadId, content) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteThreadComments (owner, threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getThreadById (threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyThreadAvailability (threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyCommentAvailability (threadId, commentId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyCommentOwner (commentId, owner) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async addCommentsReply (addReply) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadRepository
