const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const AddCommentsReplyUseCase = require('../AddCommentsReplyUseCase');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');

describe('AddCommentsReplyUseCase', () => {
    it('should orchestrating the add reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            owner: 'user-123',
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'content',
        };
        const mockCommentAvailableResult = {
            id: 'comment-123',
            owner: 'user-123',
            threadId: 'thread-123',
            content: 'content',
            date: new Date().toISOString(),
        };
        const mockAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyThreadAvailability = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentAvailability = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve(mockCommentAvailableResult)
            );
        mockReplyRepository.addCommentsReply = jest
            .fn()
            .mockImplementation(() => Promise.resolve(mockAddedReply));

        const getThreadUseCase = new AddCommentsReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const { owner, threadId, commentId, content } = useCasePayload;
        const addedReply = await getThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedReply).toStrictEqual(
            new AddedReply({
                id: 'reply-123',
                content,
                owner,
            })
        );
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
            threadId
        );
        expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
            commentId
        );
        expect(mockReplyRepository.addCommentsReply).toBeCalledWith({
            owner,
            threadId,
            commentId,
            content,
        });
    });
});
