const UserRepository = require('../UserRepository')

describe('UserRepository Interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    // arrange
    const userRepository = new UserRepository()

    // act and assert
    await expect(userRepository.addUser({})).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userRepository.verifyAvailableUsername('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
