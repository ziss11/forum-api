const AddedComment = require('../AddedComment')

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'content'
    }

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet type spesification', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'content',
      owner: {}
    }

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'content',
      owner: 'user-123'
    }

    // Action
    const { id, content, owner } = new AddedComment(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
