const ClientError = require('../ClientError')

describe('Client Error', () => {
  it('should throw error when directly use it', () => {
    expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class')
  })
})
