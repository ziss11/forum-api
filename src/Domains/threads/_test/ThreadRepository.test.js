const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
    it('should throw error when invoke abstract behaviour', async () => {
        // Arrange
        const threadRepository = new ThreadRepository();

        // Action and Assert
        expect(threadRepository.addThread('', {})).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        expect(threadRepository.getThreadById('')).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        expect(
            threadRepository.verifyThreadAvailability('')
        ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
