import expect, { createSpy } from 'expect';
import { getFacetFilteredValues } from './facet';

describe('facets routes', () => {
    describe('getFacetFilteredValues', () => {
        const ctx = {
            publishedFacet: {
                findValuesForField: createSpy().andReturn(Promise.resolve([])),
                countValuesForField: createSpy().andReturn(Promise.resolve(100)),
            },
        };

        const next = () => {};

        describe('without filter', () => {
            it('calls ctx.publishedFacet.findValuesForField with correct parameters', async () => {
                await getFacetFilteredValues(ctx, 'foo', next);

                expect(ctx.publishedFacet.findValuesForField).toHaveBeenCalledWith('foo', undefined);
            });

            it('calls ctx.publishedFacet.countValuesForField with correct parameters', async () => {
                await getFacetFilteredValues(ctx, 'foo', next);

                expect(ctx.publishedFacet.countValuesForField).toHaveBeenCalledWith('foo', undefined);
            });
        });

        describe('with filter', () => {
            it('calls ctx.publishedFacet.findValuesForField with correct parameters', async () => {
                await getFacetFilteredValues(ctx, 'foo', 'filter');

                expect(ctx.publishedFacet.findValuesForField).toHaveBeenCalledWith('foo', 'filter');
            });

            it('calls ctx.publishedFacet.countValuesForField with correct parameters', async () => {
                await getFacetFilteredValues(ctx, 'foo', 'filter');

                expect(ctx.publishedFacet.countValuesForField).toHaveBeenCalledWith('foo', 'filter');
            });
        });
    });
});
