const RegisteredUser = require('../RegisteredUser')

describe('a RegisteredUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrage
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia'
    }

    // act and assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type spesification', () => {
    // arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      fullname: 'Dicoding Indonesia'
    }

    // act and assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPESIFICATION')
  })

  it('should create registeredUser object correctly', () => {
    // arrange
    const payload = {
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia'
    }

    // act
    const { id, username, fullname } = new RegisteredUser(payload)

    // assert
    expect(id).toEqual(payload.id)
    expect(username).toEqual(payload.username)
    expect(fullname).toEqual(payload.fullname)
  })
})
