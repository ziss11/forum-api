const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const DeleteCommentsUseCase = require('../DeleteCommentsUseCase')

describe('DeleteCommentsUseCase', () => {
  it('should orchestrating the delete comments action correctly', async () => {
    // Arrange
    const owner = 'user-123'
    const threadId = 'thread-123'

    const mockDeletedCommentsResponse = {
      status: 'success'
    }

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.deleteThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDeletedCommentsResponse))

    const getThreadUseCase = new DeleteCommentsUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const deletedCommentsResponse = await getThreadUseCase.execute(owner, threadId)

    // Assert
    expect(deletedCommentsResponse).toStrictEqual({
      status: 'success'
    })
    expect(mockThreadRepository.deleteThreadComments).toBeCalledWith(owner, threadId)
  })
})
