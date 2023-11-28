const ReplyRepository = require('../ReplyRepository')

describe('ReplyRepository interface', () => {
  it('should whtor error when incoke abstract behavior', async () => {
    // Arrange
    const replyRepository = new ReplyRepository()

    // Action and Assert
    expect(replyRepository.getCommentsReplyByThreadId('', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(replyRepository.verifyReplyOwner('', '', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(replyRepository.addCommentsReply('', '', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(replyRepository.deleteCommentsReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
