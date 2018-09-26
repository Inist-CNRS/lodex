/* eslint max-len: off */
import expect, { createSpy } from 'expect';

import { publishCharacteristicsFactory } from './publishCharacteristics';

describe('publishCharacteristics', () => {
    const transformDocument = createSpy().andReturn({
        transformed: 'document',
    });
    const count = 5;
    const ctx = {
        dataset: {
            findLimitFromSkip: createSpy().andReturn(['doc']),
            findBy: 'ctx.dataset.findBy',
        },
        publishedCharacteristic: {
            addNewVersion: createSpy(),
        },
    };
    const getDocumentTransformer = createSpy().andReturn(transformDocument);
    const datasetFields = [
        {
            name: 'transformed',
            scheme: 'scheme',
        },
    ];

    before(async () => {
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
