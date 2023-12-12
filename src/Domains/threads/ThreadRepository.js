/* eslint-disable no-unused-vars */
class ThreadRepository {
    async addThread(owner, newThread) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getThreadById(threadId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyThreadAvailability(threadId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ThreadRepository;
