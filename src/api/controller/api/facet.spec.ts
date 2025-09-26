import { getFacetFilteredValues } from './facet';

describe('facets routes', () => {
    describe('getFacetFilteredValues', () => {
        const ctx = {
            publishedFacet: {
                findValuesForField: jest
                    .fn()
                    .mockImplementation(() => Promise.resolve([])),
                countValuesForField: jest
                    .fn()
                    .mockImplementation(() => Promise.resolve(100)),
            },
            request: {
                query: {
                    page: 7,
                    perPage: 20,
                },
            },
        };

        const next = () => {};

        describe('without filter', () => {
            it('calls ctx.publishedFacet.findValuesForField with correct parameters', async () => {
                await getFacetFilteredValues(ctx, 'foo', next);

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
                await getFacetFilteredValues(ctx, 'foo', next);

                expect(
                    ctx.publishedFacet.countValuesForField,
                ).toHaveBeenCalledWith('foo', undefined);
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
