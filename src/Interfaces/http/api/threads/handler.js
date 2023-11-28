const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase')
const GetThreadByIdUseCase = require('../../../../Applications/use_case/threads/GetThreadByIdUseCase')
const AddCommentsUseCase = require('../../../../Applications/use_case/comments/AddCommentsUseCase')
const AddCommentsReplyUseCase = require('../../../../Applications/use_case/replies/AddCommentsReplyUseCase')
const DeleteCommentsReplyUseCase = require('../../../../Applications/use_case/replies/DeleteCommentsReplyUseCase')
const DeleteCommentsUseCase = require('../../../../Applications/use_case/comments/DeleteCommentsUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.postThreadCommentsHandler = this.postThreadCommentsHandler.bind(this)
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this)
    this.deleteThreadCommentsHandler = this.deleteThreadCommentsHandler.bind(this)
    this.postCommentsReplyHandler = this.postCommentsReplyHandler.bind(this)
    this.deleteCommentsReplyHandler = this.deleteCommentsReplyHandler.bind(this)
  }

  async postThreadHandler (request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)

    const { id: owner } = request.auth.credentials
    const addedThread = await addThreadUseCase.execute(owner, request.payload)

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async postThreadCommentsHandler (request, h) {
    const addCommentsUseCase = this._container.getInstance(AddCommentsUseCase.name)

    const { id: owner } = request.auth.credentials
    const { id: threadId } = request.params
    const { content } = request.payload
    const addedComment = await addCommentsUseCase.execute({ owner, threadId, content })

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async getThreadByIdHandler (request, h) {
    const getThreadByIdUseCase = this._container.getInstance(GetThreadByIdUseCase.name)

    const { id: threadId } = request.params
    const thread = await getThreadByIdUseCase.execute(threadId)

    const response = h.response({
      status: 'success',
      data: {
        thread
      }
    })
    return response
  }

  async deleteThreadCommentsHandler (request, h) {
    const deleteCommentsUseCase = this._container.getInstance(DeleteCommentsUseCase.name)

    const { id: owner } = request.auth.credentials
    const { threadId, commentId } = request.params

    await deleteCommentsUseCase.execute(owner, threadId, commentId)

    const response = h.response({
      status: 'success',
      message: 'Comment deleted successfully'
    })
    return response
  }

  async postCommentsReplyHandler (request, h) {
    const addCommentsReplyUseCase = this._container.getInstance(AddCommentsReplyUseCase.name)

    const { id: owner } = request.auth.credentials
    const { threadId, commentId } = request.params
    const { content } = request.payload

    const addedReply = await addCommentsReplyUseCase.execute({ owner, threadId, commentId, content })

    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentsReplyHandler (request, h) {
    const deleteCommentsReplyUseCase = this._container.getInstance(DeleteCommentsReplyUseCase.name)

    const { id: owner } = request.auth.credentials
    const { threadId, commentId, replyId } = request.params

    await deleteCommentsReplyUseCase.execute(owner, threadId, commentId, replyId)

    const response = h.response({
      status: 'success',
      message: 'Comment reply deleted successfully'
    })
    return response
  }
}

module.exports = ThreadsHandler
