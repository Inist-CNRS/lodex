import publication from './publication';

describe('publication', () => {
    const fields = [{ foo: 'foo', count: 0 }];
    const characteristics = [{ characteristic1: 'characteristic1_value' }];

    it('should return the correct status if no dataset has been published', async () => {
        const ctx = {
            field: {
                findAll: () => Promise.resolve(fields),
            },
            publishedCharacteristic: {
                findAllVersions: () => Promise.resolve(characteristics),
            },
            publishedDataset: {
                count: () => Promise.resolve(0),
                countByFacet: () => 0,
            },
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            characteristics,
            fields,
            published: false,
        });
    });

    it.skip('should return the correct status if a dataset has been published', async () => {
        const ctx = {
            field: {
                findAll: () => Promise.resolve(fields),
            },
            publishedCharacteristic: {
                findAllVersions: () => Promise.resolve(characteristics),
            },
            publishedDataset: {
                count: () => Promise.resolve(100),
                countByFacet: () => 100,
            },
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            characteristics,
            fields: [{ foo: 'foo', count: 100 }],
            published: true,
        });
    });
});
