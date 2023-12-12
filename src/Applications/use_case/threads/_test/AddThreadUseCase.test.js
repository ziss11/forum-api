const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const owner = 'user-123';
        const useCasePayload = {
            title: 'title',
            body: 'body',
        };
        const mockAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner,
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest
            .fn()
            .mockImplementation(() => Promise.resolve(mockAddedThread));

        const getThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await getThreadUseCase.execute(
            owner,
            useCasePayload
        );

        // Assert
        expect(addedThread).toStrictEqual(
            new AddedThread({
                id: 'thread-123',
                title: useCasePayload.title,
                owner,
            })
        );
        expect(mockThreadRepository.addThread).toBeCalledWith(
            owner,
            new NewThread({
                title: useCasePayload.title,
                body: useCasePayload.body,
            })
        );
    });
});
