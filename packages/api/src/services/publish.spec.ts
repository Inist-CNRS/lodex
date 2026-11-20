import publish from './publish';

// the workers start the queues and load the themes
jest.mock('../workers', () => ({ CancelWorkerError: class extends Error {} }));

describe('publish', () => {
    it('refuses an empty dataset: there is nothing to publish', async () => {
        const ctx = {
            dataset: { count: jest.fn(async () => 0) },
            field: { findAll: jest.fn(async () => []) },
            publishedDataset: { count: jest.fn(async () => 0) },
            publishDocuments: jest.fn(),
        };
        await expect(publish(ctx)).rejects.toThrow('publish_error_no_line');
        expect(ctx.publishDocuments).not.toHaveBeenCalled();
    });
});
