import expect from 'expect';
import publication from './publication';

describe('publication', () => {
    it('should return the correct status if no dataset has been published', async () => {
        const publishedModel = [{ foo: 'foo' }];

        const ctx = {
            publishedDataset: {
                count: () => Promise.resolve(0),
            },
            publishedModel: {
                find: () => ({
                    toArray: () => Promise.resolve(publishedModel),
                }),
            },
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            published: false,
            model: publishedModel,
        });
    });

    it('should return the correct status if a dataset has been published', async () => {
        const publishedModel = [{ foo: 'foo' }];

        const ctx = {
            publishedDataset: {
                count: () => Promise.resolve(100),
            },
            publishedModel: {
                find: () => ({
                    toArray: () => Promise.resolve(publishedModel),
                }),
            },
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            published: true,
            model: publishedModel,
        });
    });
});
