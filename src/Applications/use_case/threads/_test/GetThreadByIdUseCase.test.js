const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const Comment = require('../../../../Domains/threads/entities/Comment')
const ThreadDetail = require('../../../../Domains/threads/entities/ThreadDetail')
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase')

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating the get thread by id action correctly', async () => {
    // Arrange
    const threadId = 'thread-123'
    const mockThreadDetail = new ThreadDetail({
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
          content: 'sebuah comment'
        })
      ]
    })

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetail))

    const getThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const threadDetail = await getThreadUseCase.execute(threadId)

    // Assert
    expect(threadDetail).toStrictEqual(new ThreadDetail({
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
          content: 'sebuah comment'
        })
      ]
    }))
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId)
  })
})
