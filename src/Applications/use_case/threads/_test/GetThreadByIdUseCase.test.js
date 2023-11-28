const Comment = require('../../../../Domains/comments/entities/Comment')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository')
const ThreadDetail = require('../../../../Domains/threads/entities/ThreadDetail')
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase')
const CommentReply = require('../../../../Domains/replies/entities/CommentReply')

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating the get thread by id action correctly', async () => {
    // Arrange
    const threadId = 'thread-123'
    const mockReplies = [
      new CommentReply({
        id: 'reply-_pby2_tmXV6bcvcdev8xk',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah balasan komentar'
      })
    ]
    const mockComments = [
      new Comment({
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment'
      })
    ]
    const mockThreadDetail = new ThreadDetail({
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding'
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetail))
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments))
    mockReplyRepository.getCommentsReplyByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies))

    const getThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    const threadDetail = await getThreadUseCase.execute(threadId)

    // Assert
    expect(threadDetail).toStrictEqual(
      new ThreadDetail({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          new Comment({
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment',
            replies: [
              new CommentReply({
                id: 'reply-_pby2_tmXV6bcvcdev8xk',
                username: 'johndoe',
                date: '2021-08-08T07:22:33.555Z',
                content: 'sebuah balasan komentar'
              })
            ]
          })
        ]
      })
    )
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId)
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId)
    expect(mockReplyRepository.getCommentsReplyByThreadId).toBeCalledWith(threadId)
  })
})
