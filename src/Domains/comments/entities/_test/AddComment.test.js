const AddComment = require('../AddComment')

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123'
    }

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet type spesification', () => {
    // Arrange
    const payload = {
      owner: 123,
      threadId: 123,
      content: 123
    }

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addComent object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      content: 'content'
    }

    // Action
    const { owner, threadId, content } = new AddComment(payload)

    // Assert
    expect(owner).toEqual(payload.owner)
    expect(threadId).toEqual(payload.threadId)
    expect(content).toEqual(payload.content)
  })
})
