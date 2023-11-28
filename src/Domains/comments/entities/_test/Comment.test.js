const Comment = require('../Comment')

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'id',
      username: 'username',
      date: 'date'
    }

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet type spesification', () => {
    // Arrange
    const payload = {
      id: true,
      username: 123,
      date: 123,
      content: 123,
      replies: '123'
    }

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'id-123',
      username: 'username',
      date: 'date',
      content: 'content',
      replies: []
    }

    // Action
    const { id, username, date, content, replies } = new Comment(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(username).toEqual(payload.username)
    expect(date).toEqual(payload.date)
    expect(content).toEqual(payload.content)
    expect(replies).toEqual(payload.replies)
  })
})
