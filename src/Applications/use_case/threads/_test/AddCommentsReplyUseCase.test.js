const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const AddCommentsReplyUseCase = require('../AddCommentsReplyUseCase')
const AddedReply = require('../../../../Domains/replies/entities/AddedReply')

describe('AddCommentsReplyUseCase', () => {
  it('should throw error if use case payload not contain content', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123'
    }
    const addCommentsReplyUseCase = new AddCommentsReplyUseCase({})

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
      commentId: 'comment-123',
      content: 123
    }
    const addCommentsReplyUseCase = new AddCommentsReplyUseCase({})

    // Action & Assert
    await expect(addCommentsReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENTS_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'content'
    }
    const mockCommentAvailableResult = {
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
      content: 'content',
      date: new Date().toISOString()
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
      .mockImplementation(() => Promise.resolve(mockCommentAvailableResult))
    mockThreadRepository.addCommentsReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply))

    const getThreadUseCase = new AddCommentsReplyUseCase({
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
    expect(mockThreadRepository.verifyCommentAvailability).toBeCalledWith(commentId)
    expect(mockThreadRepository.addCommentsReply).toBeCalledWith({ owner, commentId, content })
  })
})
