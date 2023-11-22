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
  }
}

module.exports = ServerTestHelper
