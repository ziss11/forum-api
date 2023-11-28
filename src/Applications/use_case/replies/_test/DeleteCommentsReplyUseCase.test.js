const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository')
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
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentAvailableResult))
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.deleteCommentsReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDeletedCommentsResponse))

    const getThreadUseCase = new DeleteCommentsReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    const deleteReplyResponse = await getThreadUseCase.execute(owner, threadId, commentId, replyId)

    // Assert
    expect(deleteReplyResponse).toStrictEqual({
      status: 'success'
    })
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId)
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(commentId)
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(commentId, replyId, owner)
    expect(mockReplyRepository.deleteCommentsReply).toBeCalledWith(replyId)
  })
})
