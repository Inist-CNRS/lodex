import { getFacetFilteredValues } from './facet';

describe('facets routes', () => {
    describe('getFacetFilteredValues', () => {
        let ctx;

        beforeEach(() => {
            ctx = {
                publishedFacet: {
                    findValuesForField: jest.fn().mockResolvedValue([
                        { value: 'test1', count: 5, _id: 'id1' },
                        { value: 'test2', count: 3, _id: 'id2' },
                    ]),
                    countValuesForField: jest.fn().mockResolvedValue(100),
                },
                request: {
                    query: {
                        page: 7,
                        perPage: 20,
                    },
                },
                body: null,
            };
        });

        describe('without filter', () => {
            it('calls ctx.publishedFacet.findValuesForField with correct parameters', async () => {
                await getFacetFilteredValues(ctx, 'foo', undefined);

                expect(
                    ctx.publishedFacet.findValuesForField,
                ).toHaveBeenCalledWith({
                    field: 'foo',
                    filter: undefined,
                    page: 7,
                    perPage: 20,
                    sortDir: undefined,
                    sortBy: undefined,
                });
            });

            it('calls ctx.publishedFacet.countValuesForField with correct parameters', async () => {
                await getFacetFilteredValues(ctx, 'foo', undefined);

                expect(
                    ctx.publishedFacet.countValuesForField,
                ).toHaveBeenCalledWith('foo', undefined);
            });

            it('sets correct response body', async () => {
                await getFacetFilteredValues(ctx, 'foo', undefined);

                expect(ctx.body).toEqual({
                    data: [
                        { value: 'test1', count: 5, id: 'id1' },
                        { value: 'test2', count: 3, id: 'id2' },
                    ],
                    total: 100,
                });
            });
        });

        describe('with filter', () => {
            it('calls ctx.publishedFacet.findValuesForField with correct parameters', async () => {
                await getFacetFilteredValues(ctx, 'foo', 'filter');

                expect(
                    ctx.publishedFacet.findValuesForField,
                ).toHaveBeenCalledWith({
                    field: 'foo',
                    filter: 'filter',
                    page: 7,
                    perPage: 20,
                    sortDir: undefined,
                    sortBy: undefined,
                });
            });

            it('calls ctx.publishedFacet.countValuesForField with correct parameters', async () => {
                await getFacetFilteredValues(ctx, 'foo', 'filter');

                expect(
                    ctx.publishedFacet.countValuesForField,
                ).toHaveBeenCalledWith('foo', 'filter');
            });
        });
    });
});
