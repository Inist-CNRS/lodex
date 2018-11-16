import { getFieldAndLatestValue } from './embedded';

const field = { name: 'name' };

const resource = {
    uri: 'uri',
    versions: [
        {
            version: 1,
            name: 'oldValue',
        },
        {
            version: 2,
            name: 'value',
        },
    ],
};

describe('embedded controller', () => {
    describe('getFieldAndLatestValue', () => {
        let ctx;
        beforeEach(() => {
            ctx = {
                query: {
                    uri: 'uri',
                    fieldName: 'name',
                },
                publishedDataset: {
                    findByUri: jest.fn(() => Promise.resolve(resource)),
                },
                field: {
                    findByName: jest.fn(() => Promise.resolve(field)),
                },
            };
        });

        it('should return a field and the related latest resource value', async () => {
            await getFieldAndLatestValue(ctx);
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith('uri');
            expect(ctx.field.findByName).toHaveBeenCalledWith('name');

            expect(ctx.body).toEqual({
                value: 'value',
                field: {
                    name: 'name',
                },
            });
        });

        it('should return a 404 if there is no field', async () => {
            ctx.field.findByName = jest.fn(() => Promise.resolve(null));
            await getFieldAndLatestValue(ctx);

            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith('uri');
            expect(ctx.field.findByName).toHaveBeenCalledWith('name');

            expect(ctx.status).toBe(404);
            expect(ctx.body).toBeUndefined();
        });

        it('should return a 404 if there is no resource', async () => {
            ctx.publishedDataset.findByUri = jest.fn(() =>
                Promise.resolve(null),
            );
            await getFieldAndLatestValue(ctx);

            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith('uri');
            expect(ctx.field.findByName).toHaveBeenCalledWith('name');

            expect(ctx.status).toBe(404);
            expect(ctx.body).toBeUndefined();
        });
    });
});
