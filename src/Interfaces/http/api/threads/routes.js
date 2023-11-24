const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forum_jwt'
    }
  },
  {
    method: 'POST',
    path: '/threads/{id}/comments',
    handler: handler.postThreadCommentsHandler,
    options: {
      auth: 'forum_jwt'
    }
  },
  {
    method: 'GET',
    path: '/threads/{id}',
    handler: handler.getThreadByIdHandler
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteThreadCommentsHandler,
    options: {
      auth: 'forum_jwt'
    }
  }
])

module.exports = routes
