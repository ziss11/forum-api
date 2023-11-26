const AddReply = require('../AddReply')

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      content: 'sebuah balasan'
    }

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet type spesification', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 123
    }

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addReply object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'sebuah balasan'
    }

    // Action
    const { owner, threadId, commentId, content } = new AddReply(payload)

    // Assert
    expect(owner).toEqual(payload.owner)
    expect(threadId).toEqual(payload.threadId)
    expect(commentId).toEqual(payload.commentId)
    expect(content).toEqual(payload.content)
  })
})
