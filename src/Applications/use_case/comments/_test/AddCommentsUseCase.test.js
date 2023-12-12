const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const AddCommentsUseCase = require('../AddCommentsUseCase');

describe('AddComments', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            owner: 'user-123',
            threadId: 'thread-123',
            content: 'content',
        };
        const mockAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verifyThreadAvailability = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.addThreadCommentsById = jest
            .fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment));

        const getThreadUseCase = new AddCommentsUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const { owner, threadId, content } = useCasePayload;
        const addedComments = await getThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedComments).toStrictEqual(
            new AddedComment({
                id: 'comment-123',
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            })
        );
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
            threadId
        );
        expect(mockCommentRepository.addThreadCommentsById).toBeCalledWith(
            owner,
            threadId,
            content
        );
    });
});
