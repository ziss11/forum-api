const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const AddedComments = require('../../../../Domains/comments/entities/AddedComments')
const AddCommentsUseCase = require('../AddCommentsUseCase')

describe('AddComments', () => {
  it('should throw error if use case payload not contain content', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123'
    }
    const addCommentsReplyUseCase = new AddCommentsUseCase({})

    // Action & Assert
    await expect(addCommentsReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENTS_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if content not string', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      content: 123
    }
    const addCommentsReplyUseCase = new AddCommentsUseCase({})

    // Action & Assert
    await expect(addCommentsReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENTS_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

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
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.addThreadCommentsById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComments))

    const getThreadUseCase = new AddCommentsUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const { owner, threadId, content } = useCasePayload
    const addedComments = await getThreadUseCase.execute(useCasePayload)

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
