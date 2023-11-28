const AddedComments = require('../AddedComments')

describe('a AddedComments entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'content'
    }

    // Action and Assert
    expect(() => new AddedComments(payload)).toThrowError('ADDED_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet type spesification', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'content',
      owner: {}
    }

    // Action and Assert
    expect(() => new AddedComments(payload)).toThrowError('ADDED_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addedComments object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'content',
      owner: 'user-123'
    }

    // Action
    const { id, content, owner } = new AddedComments(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
