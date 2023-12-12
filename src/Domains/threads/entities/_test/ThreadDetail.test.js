const Comment = require('../../../comments/entities/Comment');
const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'id',
            title: 'title',
            body: 'body',
            date: 'date',
        };

        // Action and Assert
        expect(() => new ThreadDetail(payload)).toThrowError(
            'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet type spesification', () => {
        // Arrange
        const payload = {
            id: 123,
            title: {},
            body: true,
            date: {},
            username: 123,
            comments: {},
        };

        // Action and Assert
        expect(() => new ThreadDetail(payload)).toThrowError(
            'THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create threadDetail object correctly', () => {
        // Arrange
        const payload = {
            id: 'id',
            title: 'title',
            body: 'body',
            date: 'date',
            username: 'username',
            comments: [
                new Comment({
                    id: 'id-123',
                    username: 'username',
                    date: 'date',
                    content: 'content',
                }),
            ],
        };

        // Action
        const { id, title, body, date, username, comments } = new ThreadDetail(
            payload
        );

        // Assert
        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
        expect(comments).toEqual(payload.comments);
    });
});
