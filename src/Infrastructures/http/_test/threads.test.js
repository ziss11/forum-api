const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')
const container = require('../../container')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia'
      }
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'Dicoding Indonesia'
      }
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: 123
      }
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
    })
  })

  describe('when POST /threads/{id}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Dicoding Indonesia'
      }
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = await ServerTestHelper.getThreadHelper({ server, accessToken })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
    })

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'Dicoding Indonesia'
      }
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = 'thread-122'

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 if comment deleted', async () => {
      // Arrange
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = await ServerTestHelper.getThreadHelper({ server, accessToken })
      const commentId = await ServerTestHelper.getCommentHelper({ server, accessToken, threadId })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 403 if user not owner', async () => {
      // Arrange
      const server = await createServer(container)
      const accessToken1 = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = await ServerTestHelper.getThreadHelper({ server, accessToken: accessToken1 })
      const commentId = await ServerTestHelper.getCommentHelper({ server, accessToken: accessToken1, threadId })

      const accessToken2 = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server, username: 'dicoding2' })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 404 if thread or comment not found', async () => {
      // Arrange
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = 'thread-122'
      const commentId = 'comment-122'

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and detail thread', async () => {
      // Arrange
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = await ServerTestHelper.getThreadHelper({ server, accessToken })
      await ServerTestHelper.getCommentHelper({ server, accessToken, threadId })

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
    })

    it('should show **komentar telah dihapus** when get deleted comment', async () => {
      // Arrange
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = await ServerTestHelper.getThreadHelper({ server, accessToken })
      const commentId1 = await ServerTestHelper.getCommentHelper({ server, accessToken, threadId })
      await ServerTestHelper.getCommentHelper({ server, accessToken, threadId })
      await ServerTestHelper.deleteThreadCommentHandler({ server, accessToken, threadId, commentId: commentId1 })

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread.comments).toHaveLength(2)

      const [comment1, comment2] = responseJson.data.thread.comments
      expect(comment1.content).toEqual('**komentar telah dihapus**')
      expect(comment2.content).toEqual('thread comment')
    })

    it('should show **balasan telah dihapus** when get deleted reply', async () => {
      // Arrange
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = await ServerTestHelper.getThreadHelper({ server, accessToken })
      const commentId = await ServerTestHelper.getCommentHelper({ server, accessToken, threadId })
      await ServerTestHelper.getCommentHelper({ server, accessToken, threadId })

      const replyId1 = await ServerTestHelper.getReplyHelper({ server, accessToken, threadId, commentId })
      await ServerTestHelper.getReplyHelper({ server, accessToken, threadId, commentId })
      await ServerTestHelper.deleteCommentsReplyHandler({ server, accessToken, threadId, commentId, replyId: replyId1 })

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread.comments).toHaveLength(2)

      const comments = responseJson.data.thread.comments
      const [reply1, reply2] = comments[0].replies
      expect(reply1.content).toEqual('**balasan telah dihapus**')
      expect(reply2.content).toEqual('thread comment reply')
    })

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container)
      const threadId = 'thread-122'

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 400 when payload not contain content', async () => {
      // Arrange
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = await ServerTestHelper.getThreadHelper({ server, accessToken })
      const commentId = await ServerTestHelper.getCommentHelper({ server, accessToken, threadId })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: {}
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 404 when thread or comment not found', async () => {
      // Arrange
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = 'thread-122'
      const commentId = 'comment-122'

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: { content: 'sebuah balasan' }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 201 and persisted comment reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan'
      }

      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = await ServerTestHelper.getThreadHelper({ server, accessToken })
      const commentId = await ServerTestHelper.getCommentHelper({ server, accessToken, threadId })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 if reply deleted', async () => {
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = await ServerTestHelper.getThreadHelper({ server, accessToken })
      const commentId = await ServerTestHelper.getCommentHelper({ server, accessToken, threadId })
      const replyId = await ServerTestHelper.getReplyHelper({ server, accessToken, threadId, commentId })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 403 when user not the reply owner', async () => {
      // Arrange
      const server = await createServer(container)
      const accessToken1 = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = await ServerTestHelper.getThreadHelper({ server, accessToken: accessToken1 })
      const commentId = await ServerTestHelper.getCommentHelper({ server, accessToken: accessToken1, threadId })
      const replyId = await ServerTestHelper.getReplyHelper({ server, accessToken: accessToken1, threadId, commentId })

      const accessToken2 = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server, username: 'dicoding2' })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 404 if thread or comment or reply not found', async () => {
      // Arrange
      const server = await createServer(container)
      const accessToken = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server })
      const threadId = 'thread-122'
      const commentId = 'comment-122'
      const replyId = 'reply-122'

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })
  })
})
