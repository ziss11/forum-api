const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase')
const AddCommentsByIdUseCase = require('../../../../Applications/use_case/threads/AddCommentsByIdUseCase.js')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.postThreadCommentsHandler = this.postThreadCommentsHandler.bind(this)
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
}

module.exports = ThreadsHandler
