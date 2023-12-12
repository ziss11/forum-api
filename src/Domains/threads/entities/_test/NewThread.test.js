const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'abc',
        };

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError(
            'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet data type spesification', () => {
        // Arrange
        const payload = {
            title: true,
            body: 123,
        };

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError(
            'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create newThread object correctly', () => {
        // Arrange
        const payload = {
            title: 'title',
            body: 'body',
        };

        // Action
        const { title, body } = new NewThread(payload);

        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });
});
