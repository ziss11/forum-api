const AuthenticationError = require('../AuthenticationError')

describe('AuthenticationError', () => {
  it('should create an error correctly', () => {
    const authError = new AuthenticationError('authentication error')

    expect(authError.statusCode).toEqual(401)
    expect(authError.message).toEqual('authentication error')
    expect(authError.name).toEqual('AuthenticationError')
  })
})
