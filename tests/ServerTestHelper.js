/* istanbul ignore file */
const ServerTestHelper = {
  async getAccessTokenAndUserIdHelper ({ server, username = 'dicoding' }) {
    const userPayload = {
      username,
      password: 'secret'
    }

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...userPayload,
        fullname: 'fullname'
      }
    })

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload
    })

    const { accessToken } = JSON.parse(responseAuth.payload).data
    return accessToken
  },

  async getThreadHelper ({ server, accessToken }) {
    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'thread title',
        body: 'thread body'
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    const { id } = JSON.parse(responseThread.payload).data.addedThread
    return id
  },

  async getCommentHelper ({ server, accessToken, threadId }) {
    const responseThread = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: 'thread comment'
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const { id } = JSON.parse(responseThread.payload).data.addedComment
    return id
  },

  async getCommentsReplyHelper ({ server, accessToken, threadId, commentId }) {
    const responseThread = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: {
        content: 'thread comment reply'
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const { id } = JSON.parse(responseThread.payload).data.addedReply
    return id
  },

  async getReplyHelper ({ server, accessToken, threadId, commentId }) {
    const responseThread = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: {
        content: 'thread comment reply'
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const { id } = JSON.parse(responseThread.payload).data.addedReply
    return id
  },

  async deleteThreadCommentHandler ({ server, accessToken, threadId, commentId }) {
    await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  async deleteCommentsReplyHandler ({ server, accessToken, threadId, commentId, replyId }) {
    await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

module.exports = ServerTestHelper
