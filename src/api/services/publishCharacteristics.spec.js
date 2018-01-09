/* eslint max-len: off */
import expect, { createSpy } from 'expect';

import publishCharacteristics from './publishCharacteristics';

describe('publishCharacteristics', () => {
    const transformDocument = createSpy().andReturn({
        transformed: 'document',
    });
    const count = 5;
    const ctx = {
        getDocumentTransformer: createSpy().andReturn(transformDocument),
        uriDataset: {
            findLimitFromSkip: createSpy().andReturn(['doc']),
        },
        publishedCharacteristic: {
            addNewVersion: createSpy(),
        },
    };
    const datasetFields = [
        {
            name: 'transformed',
            scheme: 'scheme',
        },
    ];

    before(async () => {
        await publishCharacteristics(ctx, datasetFields, count);
    });

    it('should call getDocumentTransformer', () => {
        expect(ctx.getDocumentTransformer).toHaveBeenCalledWith(datasetFields);
    });

    it('should call ctx.uriDataset.findLimitFromSkip', () => {
        expect(ctx.uriDataset.findLimitFromSkip).toHaveBeenCalledWith(
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
