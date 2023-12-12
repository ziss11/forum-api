const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'id',
            title: 'title',
        };

        // Action and Assert
        expect(() => new AddedThread(payload)).toThrowError(
            'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet type spesification', () => {
        // Arrange
        const payload = {
            id: true,
            title: 123,
            owner: {},
        };

        // Action and Assert
        expect(() => new AddedThread(payload)).toThrowError(
            'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create addedThread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'Thread 1',
            owner: 'user-123',
        };

        // Action
        const { id, title, owner } = new AddedThread(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(owner).toEqual(payload.owner);
    });
});
