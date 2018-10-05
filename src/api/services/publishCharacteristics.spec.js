/* eslint max-len: off */
import { publishCharacteristicsFactory } from './publishCharacteristics';

describe('publishCharacteristics', () => {
    let transformDocument;
    let count;
    let ctx;
    let getDocumentTransformer;
    let datasetFields;

    beforeAll(async () => {
        transformDocument = jest.fn(() => ({
            transformed: 'document',
        }));
        count = 5;
        ctx = {
            dataset: {
                findLimitFromSkip: jest.fn().mockImplementation(() => ['doc']),
                findBy: 'ctx.dataset.findBy',
            },
            publishedCharacteristic: {
                addNewVersion: jest.fn(),
            },
        };
        getDocumentTransformer = jest.fn(() => transformDocument);
        datasetFields = [
            {
                name: 'transformed',
                scheme: 'scheme',
            },
        ];
        await publishCharacteristicsFactory({ getDocumentTransformer })(
            ctx,
            datasetFields,
            count,
        );
    });

    it('should call getDocumentTransformer', () => {
        expect(getDocumentTransformer).toHaveBeenCalledWith(
            'ctx.dataset.findBy',
            datasetFields,
        );
    });

    it('should call ctx.dataset.findLimitFromSkip', () => {
        expect(ctx.dataset.findLimitFromSkip).toHaveBeenCalledWith(
            1,
            count - 1,
        );
    });

    it('should call transformDocument returned by getDocumentTransformer', () => {
        expect(transformDocument).toHaveBeenCalledWith('doc');
    });

    it('should call ctx.publishedCharacteristic.addNewVersion', () => {
        expect(ctx.publishedCharacteristic.addNewVersion).toHaveBeenCalledWith({
            transformed: 'document',
        });
    });
});
