const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentsUseCase = require('../DeleteCommentsUseCase.js');

describe('DeleteCommentsUseCase', () => {
    it('should orchestrating the delete comments action correctly', async () => {
        // Arrange
        const owner = 'user-123';
        const threadId = 'thread-123';
        const commentId = 'comment-123';

        const mockDeletedCommentsResponse = {
            status: 'success',
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verifyThreadAvailability = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteThreadComments = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve(mockDeletedCommentsResponse)
            );

        const getThreadUseCase = new DeleteCommentsUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const deletedCommentsResponse = await getThreadUseCase.execute(
            owner,
            threadId,
            commentId
        );

        // Assert
        expect(deletedCommentsResponse).toStrictEqual({
            status: 'success',
        });
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
            threadId
        );
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
            commentId,
            owner
        );
        expect(mockCommentRepository.deleteThreadComments).toBeCalledWith(
            commentId
        );
    });
});
