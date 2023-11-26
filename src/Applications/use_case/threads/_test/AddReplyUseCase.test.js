const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const AddReplyUseCase = require('../AddReplyUseCase')
const AddedReply = require('../../../../Domains/threads/entities/AddedReply')

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'content'
    }
    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.addCommentsReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply))

    const getThreadUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const { owner, threadId, commentId, content } = useCasePayload
    const addedReply = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content,
      owner
    }))
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId)
    expect(mockThreadRepository.verifyCommentAvailability).toBeCalledWith(threadId, commentId)
    expect(mockThreadRepository.addCommentsReply).toBeCalledWith({ owner, commentId, content })
  })
})
