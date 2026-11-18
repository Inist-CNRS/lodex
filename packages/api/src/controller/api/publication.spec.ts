import publication from './publication';

describe('publication', () => {
    const fields = [{ foo: 'foo', count: 0 }];
    const lastCharacteristics = { characteristic1: 'characteristic1_value' };

    const buildCtx = (publishedDocument: unknown): any => ({
        field: {
            findAll: () => Promise.resolve(fields),
        },
        publishedCharacteristic: {
            findLastVersion: () => Promise.resolve(lastCharacteristics),
        },
        publishedDataset: {
            findOne: () => Promise.resolve(publishedDocument),
        },
    });

    it('should return the correct status if no dataset has been published', async () => {
        const ctx = buildCtx(null);

        await publication(ctx);

        expect(ctx.body).toEqual({
            characteristics: [lastCharacteristics],
            fields,
            published: false,
        });
    });

    it('should return the correct status if a dataset has been published', async () => {
        const ctx = buildCtx({ _id: 'id' });

        await publication(ctx);

        expect(ctx.body).toEqual({
            characteristics: [lastCharacteristics],
            fields,
            published: true,
        });
    });
});
