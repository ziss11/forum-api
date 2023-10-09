const bcrypt = require('bcrypt')
const BcryptPasswordHash = require('../BcryptPasswordHash')

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // arrange
      const spyHash = jest.spyOn(bcrypt, 'hash')
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)

      // act
      const ecryptedPassword = await bcryptPasswordHash.hash('plain_password')

      // assert
      expect(typeof ecryptedPassword).toEqual('string')
      expect(ecryptedPassword).not.toEqual('plain_password')
      expect(spyHash).toBeCalledWith('plain_password', 10)
    })
  })
})
