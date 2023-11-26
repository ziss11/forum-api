const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const AddedComments = require('../../../../Domains/threads/entities/AddedComments')
const AddCommentsUseCase = require('../AddCommentsUseCase')

describe('AddComments', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      content: 'content'
    }
    const mockAddedComments = new AddedComments({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComments))
    mockThreadRepository.addThreadCommentsById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComments))

    const getThreadUseCase = new AddCommentsUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const { owner, threadId, content } = useCasePayload
    const addedComments = await getThreadUseCase.execute(owner, threadId, content)

    // Assert
    expect(addedComments).toStrictEqual(new AddedComments({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    }))
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId)
    expect(mockThreadRepository.addThreadCommentsById).toBeCalledWith(owner, threadId, content)
  })
})
