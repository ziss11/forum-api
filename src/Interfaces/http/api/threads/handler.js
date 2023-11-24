const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase')
const AddCommentsByIdUseCase = require('../../../../Applications/use_case/threads/AddCommentsByIdUseCase.js')
const DeleteCommentsUseCase = require('../../../../Applications/use_case/threads/DeleteCommentsUseCase')
const GetThreadByIdUseCase = require('../../../../Applications/use_case/threads/GetThreadByIdUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.postThreadCommentsHandler = this.postThreadCommentsHandler.bind(this)
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this)
    this.deleteThreadCommentsHandler = this.deleteThreadCommentsHandler.bind(this)
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
    const addCommentsByIdUseCase = this._container.getInstance(AddCommentsByIdUseCase.name)

    const { id: owner } = request.auth.credentials
    const { id: threadId } = request.params
    const { content } = request.payload
    const addedComment = await addCommentsByIdUseCase.execute(owner, threadId, content)

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
}

module.exports = ThreadsHandler