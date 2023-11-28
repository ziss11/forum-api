const CommentReply = require('../CommentReply')

describe('a CommentReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'id',
      username: 'username',
      date: 'date'
    }

    // Action and Assert
    expect(() => new CommentReply(payload)).toThrowError('COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet type spesification', () => {
    // Arrange
    const payload = {
      id: true,
      username: 123,
      date: 123,
      content: 123
    }

    // Action and Assert
    expect(() => new CommentReply(payload)).toThrowError('COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create comment reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'id-123',
      username: 'username',
      date: 'date',
      content: 'content',
      isDelete: false
    }

    // Action
    const { id, username, date, isDelete, content } = new CommentReply(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(username).toEqual(payload.username)
    expect(date).toEqual(payload.date)
    expect(isDelete).toEqual(payload.isDelete)
    expect(content).toEqual(payload.content)
  })
})
