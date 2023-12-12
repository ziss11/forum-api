const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(owner, useCasePayload) {
        const newThread = new NewThread(useCasePayload);
        return this._threadRepository.addThread(owner, newThread);
    }
}

module.exports = AddThreadUseCase;
