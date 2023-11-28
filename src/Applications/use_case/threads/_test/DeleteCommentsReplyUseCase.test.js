const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const DeleteCommentsReplyUseCase = require('../DeleteCommentsReplyUseCase')

describe('DeleteCommentsReplyUseCase', () => {
  it('should orchestrating the delete comments reply action correctly', async () => {
    // Arrange
    const owner = 'user-123'
    const threadId = 'thread-123'
    const commentId = 'comment-123'
    const replyId = 'reply-123'

    const mockCommentAvailableResult = {
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
      content: 'content',
      date: new Date().toISOString()
    }
    const mockDeletedCommentsResponse = {
      status: 'success'
    }

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentAvailableResult))
    mockThreadRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.deleteCommentsReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDeletedCommentsResponse))

    const getThreadUseCase = new DeleteCommentsReplyUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const deleteReplyResponse = await getThreadUseCase.execute(owner, threadId, commentId, replyId)

    // Assert
    expect(deleteReplyResponse).toStrictEqual({
      status: 'success'
    })
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId)
    expect(mockThreadRepository.verifyCommentAvailability).toBeCalledWith(commentId)
    expect(mockThreadRepository.verifyReplyOwner).toBeCalledWith(commentId, replyId, owner)
    expect(mockThreadRepository.deleteCommentsReply).toBeCalledWith(replyId)
  })
})
