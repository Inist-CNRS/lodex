import expect from 'expect';
import publication from './publication';

describe('publication', () => {
    const fields = [{ foo: 'foo', count: 0 }];
    const characteristics = [{ characteristic1: 'characteristic1_value' }];

    it('should return the correct status if no dataset has been published', async () => {
        const ctx = {
            field: {
                findAll: () => Promise.resolve(fields),
                findPrefetchDatasetFields: expect
                    .createSpy()
                    .andReturn(Promise.resolve([])),
            },
            publishedCharacteristic: {
                findAllVersions: () => Promise.resolve(characteristics),
            },
            publishedDataset: {
                count: () => Promise.resolve(0),
                countByFacet: () => 0,
            },
            preparePublication: expect.createSpy(),
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            characteristics,
            fields,
            published: false,
        });
        expect(ctx.field.findPrefetchDatasetFields).toNotHaveBeenCalled();
    });

    it('should return the correct status if a dataset has been published with prefetchedData', async () => {
        const ctx = {
            field: {
                findAll: () => Promise.resolve(fields),
                findPrefetchDatasetFields: expect
                    .createSpy()
                    .andReturn(Promise.resolve(['field1', 'field2'])),
            },
            publishedCharacteristic: {
                findAllVersions: () => Promise.resolve(characteristics),
            },
            findPrefetchDatasetFields: expect
                .createSpy()
                .andReturn(Promise.resolve([])),
            publishedDataset: {
                count: () => Promise.resolve(100),
                countByFacet: () => 100,
            },
            preFetchFormatData: expect.createSpy().andReturn('prefetched data'),
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            characteristics,
            fields: [{ foo: 'foo', count: 100 }],
            published: true,
            prefetchedData: 'prefetched data',
        });

        expect(ctx.field.findPrefetchDatasetFields).toHaveBeenCalled();
        expect(ctx.preFetchFormatData).toHaveBeenCalledWith(
            ['field1', 'field2'],
            characteristics[0],
        );
    });

    it('should not prefetchData fi no dataset field with prefetch found', async () => {
        const ctx = {
            field: {
                findAll: () => Promise.resolve(fields),
                findPrefetchDatasetFields: expect
                    .createSpy()
                    .andReturn(Promise.resolve([])),
            },
            publishedCharacteristic: {
                findAllVersions: () => Promise.resolve(characteristics),
            },
            findPrefetchDatasetFields: expect
                .createSpy()
                .andReturn(Promise.resolve([])),
            publishedDataset: {
                count: () => Promise.resolve(100),
                countByFacet: () => 100,
            },
            preFetchFormatData: expect.createSpy().andReturn('prefetched data'),
        };

        await publication(ctx);

        expect(ctx.body).toEqual({
            characteristics,
            fields: [{ foo: 'foo', count: 100 }],
            published: true,
            prefetchedData: {},
        });

        expect(ctx.field.findPrefetchDatasetFields).toHaveBeenCalled();
        expect(ctx.preFetchFormatData).toNotHaveBeenCalled();
    });
});
