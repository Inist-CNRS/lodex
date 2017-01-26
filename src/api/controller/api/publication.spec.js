import expect from 'expect';
import publication from './publication';

describe('publication', () => {
    it('should return the correct status if no dataset has been published', async () => {
        const field = [{ foo: 'foo' }];

        const ctx = {
            publishedDataset: {
                count: () => Promise.resolve(0),
            },
            field: {
                find: () => ({
                    toArray: () => Promise.resolve(field),
                }),
            },
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            published: false,
            model: field,
        });
    });

    it('should return the correct status if a dataset has been published', async () => {
        const field = [{ foo: 'foo' }];

        const ctx = {
            publishedDataset: {
                count: () => Promise.resolve(100),
            },
            field: {
                find: () => ({
                    toArray: () => Promise.resolve(field),
                }),
            },
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            published: true,
            model: field,
        });
    });
});
