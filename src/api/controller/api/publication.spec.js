import expect from 'expect';
import publication from './publication';

describe('publication', () => {
    const fields = [{ foo: 'foo' }];
    const characteristics = [{ characteristic1: 'characteristic1_value' }];

    it('should return the correct status if no dataset has been published', async () => {

        const ctx = {
            field: {
                find: () => ({
                    toArray: () => Promise.resolve(fields),
                }),
            },
            publishedCharacteristic: {
                find: () => ({
                    toArray: () => Promise.resolve(characteristics),
                }),
            },
            publishedDataset: {
                count: () => Promise.resolve(0),
            },
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            characteristics,
            fields,
            published: false,
        });
    });

    it('should return the correct status if a dataset has been published', async () => {
        const ctx = {
            field: {
                find: () => ({
                    toArray: () => Promise.resolve(fields),
                }),
            },
            publishedCharacteristic: {
                find: () => ({
                    toArray: () => Promise.resolve(characteristics),
                }),
            },
            publishedDataset: {
                count: () => Promise.resolve(100),
            },
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            characteristics,
            fields,
            published: true,
        });
    });
});
