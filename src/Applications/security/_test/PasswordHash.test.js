const PasswordHash = require('../PasswordHash')

describe('PasswordHash interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    // arrange
    const passwordHash = new PasswordHash()

    // act and assert
    await expect(passwordHash.hash('dummy_password')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
  })
})
