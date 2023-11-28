const Comment = require('../../../Domains/comments/entities/Comment')
const CommentReply = require('../../../Domains/replies/entities/CommentReply')
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail')

class GetThreadByIdUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute (threadId) {
    const thread = await this._threadRepository.getThreadById(threadId)
    const comments = await this._commentRepository.getCommentByThreadId(threadId)
    const replies = await this._replyRepository.getCommentsReplyByThreadId(threadId)

    const commentsWithReplies = comments.map(comment => {
      const commentReplies = replies.filter(reply => reply.commentId === comment.id)
        .map(reply => {
          return new CommentReply({
            id: reply.id,
            username: reply.username,
            date: reply.date,
            content: reply.isDelete ? '**balasan telah dihapus**' : reply.content
          })
        })

      return new Comment({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.isDelete ? '**komentar telah dihapus**' : comment.content,
        replies: commentReplies
      })
    })

    const result = new ThreadDetail({ ...thread, comments: commentsWithReplies })
    return result
  }
}

module.exports = GetThreadByIdUseCase
