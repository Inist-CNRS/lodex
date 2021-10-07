import tranformAllDocuments from './transformAllDocuments';
import progress from './progress';

jest.mock('./progress');

describe('tranformAllDocuments', () => {
    let transformerCallCount = 0;

    const dataset = {
        length: 1000,
        map: jest.fn().mockImplementation(() => {
            // Emulate fluctuant transformed results
            transformerCallCount++;
            return Array(transformerCallCount).fill('transformed dataset');
        }),
    };

    const count = 2001;
    const findLimitFromSkip = jest.fn().mockImplementation(() => dataset);
    const insertBatch = jest.fn();
    const transformDocument = jest
        .fn()
        .mockImplementation(() => Promise.resolve('transformedDocument'));

    beforeAll(async () => {
        await tranformAllDocuments(
            count,
            findLimitFromSkip,
            insertBatch,
            transformDocument,
        );
    });

    it('should load items from the original dataset and insert them in the publishedDataset by page of 100', () => {
        expect(findLimitFromSkip).toHaveBeenCalledWith(1000, 0, {
            lodex_published: { $exists: false },
        });
        expect(findLimitFromSkip).toHaveBeenCalledWith(1000, 1000, {
            lodex_published: { $exists: false },
        });
        expect(findLimitFromSkip).toHaveBeenCalledWith(1000, 2000, {
            lodex_published: { $exists: false },
        });
    });

    it('should map dataset to transformDocument', () => {
        expect(dataset.map).toHaveBeenCalledWith(transformDocument);
    });

    it('should insert all transformedDocument', () => {
        expect(insertBatch).toHaveBeenCalledWith(['transformed dataset']);
    });

    it('should have called progress.incrementProgress with transformedDataset.length', () => {
        expect(progress.incrementProgress.mock.calls).toEqual([[1], [2], [3]]);
    });
});
