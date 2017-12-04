/* eslint max-len: off */
import expect, { createSpy } from 'expect';

import {
    getPage,
    getRemovedPage,
    editResource,
    removeResource,
    restoreResource,
    createResource,
} from './publishedDataset';

describe('publishedDataset', () => {
    describe('getPage', () => {
        const ctx = {
            publishedDataset: {
                findPage: createSpy().andReturn(
                    Promise.resolve({
                        data: [
                            { uri: 1, versions: [{ v: 1 }, { v: 2 }] },
                            {
                                uri: 2,
                                versions: [{ v: 1 }, { v: 2 }, { v: 3 }],
                            },
                            { uri: 3, versions: [{ v: 1 }] },
                        ],
                        total: 42,
                    }),
                ),
            },
            field: {
                findFacetNames: createSpy().andReturn(['facet1', 'facet2']),
                findSearchableNames: createSpy().andReturn([
                    'searchable1',
                    'searchable2',
                ]),
            },
            request: {
                query: {
                    page: 1,
                    perPage: 100,
                    match: 'match',
                    facet1: 'facet1value',
                },
            },
        };

        it('should call ctx.publishedDataset.findPage', async () => {
            await getPage(ctx);

            expect(ctx.publishedDataset.findPage).toHaveBeenCalledWith({
                page: 1,
                perPage: 100,
                sortBy: undefined,
                sortDir: undefined,
                match: 'match',
                facets: { facet1: 'facet1value' },
                invertedFacets: [],
                searchableFieldNames: ['searchable1', 'searchable2'],
                facetFieldNames: ['facet1', 'facet2'],
            });
        });

        it('should return only the last version of each doc', async () => {
            await getPage(ctx);

            expect(ctx.body).toEqual({
                data: [{ uri: 1, v: 2 }, { uri: 2, v: 3 }, { uri: 3, v: 1 }],
                total: 42,
            });
        });
    });

    describe('getRemovedPage', () => {
        const ctx = {
            publishedDataset: {
                findRemovedPage: createSpy().andReturn(
                    Promise.resolve({
                        data: [
                            {
                                uri: 1,
                                versions: [{ v: 1 }, { v: 2 }],
                                reason: 'reason1',
                                removed_at: 'removed_at1',
                            },
                            {
                                uri: 2,
                                versions: [{ v: 1 }, { v: 2 }, { v: 3 }],
                                reason: 'reason2',
                                removed_at: 'removed_at2',
                            },
                            {
                                uri: 3,
                                versions: [{ v: 1 }],
                                reason: 'reason3',
                                removed_at: 'removed_at3',
                            },
                        ],
                        total: 42,
                    }),
                ),
            },
            request: {
                query: {
                    page: 1,
                    perPage: 100,
                },
            },
        };

        it('should call ctx.publishedDataset.findRemovedPage', async () => {
            await getRemovedPage(ctx);

            expect(ctx.publishedDataset.findRemovedPage).toHaveBeenCalledWith(
                1,
                100,
            );
        });

        it('should return only the last version of each doc', async () => {
            await getRemovedPage(ctx);

            expect(ctx.body).toEqual({
                data: [
                    {
                        uri: 1,
                        v: 2,
                        reason: 'reason1',
                        removed_at: 'removed_at1',
                    },
                    {
                        uri: 2,
                        v: 3,
                        reason: 'reason2',
                        removed_at: 'removed_at2',
                    },
                    {
                        uri: 3,
                        v: 1,
                        reason: 'reason3',
                        removed_at: 'removed_at3',
                    },
                ],
                total: 42,
            });
        });
    });

    describe('editResource', () => {
        const ctx = {
            publishedDataset: {
                findByUri: createSpy().andReturn(
                    Promise.resolve('found resource'),
                ),
                addVersion: createSpy().andReturn(Promise.resolve('foo')),
            },
            request: {
                body: {
                    uri: 'the uri',
                },
            },
        };

        it('should find the resource by its uri', async () => {
            await editResource(ctx);

            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(
                'the uri',
            );
        });

        it('should add the new version', async () => {
            await editResource(ctx);

            expect(ctx.publishedDataset.addVersion).toHaveBeenCalledWith(
                'found resource',
                { uri: 'the uri' },
            );
        });

        it('should return the new version', async () => {
            await editResource(ctx);

            expect(ctx.body).toEqual('foo');
        });
    });

    describe('removeResource', () => {
        const ctx = {
            publishedDataset: {
                hide: createSpy().andReturn(Promise.resolve('foo')),
            },
            request: {
                body: {
                    uri: 'the uri',
                    reason: 'the reason',
                },
            },
        };

        it('should hide the resource', async () => {
            await removeResource(ctx);

            expect(ctx.publishedDataset.hide).toHaveBeenCalledWith(
                'the uri',
                'the reason',
            );
        });

        it('should return the result', async () => {
            await removeResource(ctx);

            expect(ctx.body).toEqual('foo');
        });
    });

    describe('restoreResource', () => {
        const ctx = {
            publishedDataset: {
                restore: createSpy().andReturn(Promise.resolve('foo')),
            },
            request: {
                body: {
                    uri: 'the uri',
                },
            },
        };

        it('should restore the resource', async () => {
            await restoreResource(ctx);

            expect(ctx.publishedDataset.restore).toHaveBeenCalledWith(
                'the uri',
            );
        });

        it('should return the result', async () => {
            await restoreResource(ctx);

            expect(ctx.body).toEqual('foo');
        });
    });

    describe('createResource', () => {
        it('should call findByUri with body.uri and create with body', async () => {
            const ctx = {
                publishedDataset: {
                    findByUri: createSpy().andReturn(null),
                    create: createSpy().andReturn('create result'),
                },
                request: {
                    body: {
                        uri: 'the uri',
                        data: 'value',
                    },
                },
            };

            await createResource(ctx);

            expect(ctx.body).toEqual({ uri: 'the uri' });
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(
                'the uri',
            );
            expect(ctx.publishedDataset.create).toHaveBeenCalledWith({
                uri: 'the uri',
                data: 'value',
            });
        });

        it('should call findByUri with body.uri and return 401 if it found something', async () => {
            const ctx = {
                publishedDataset: {
                    findByUri: createSpy().andReturn('found something'),
                    create: createSpy().andReturn('create result'),
                },
                request: {
                    body: {
                        uri: 'the uri',
                        data: 'value',
                    },
                },
            };

            await createResource(ctx);

            expect(ctx.body).toBe('uri_conflict');
            expect(ctx.status).toBe(400);
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(
                'the uri',
            );
            expect(ctx.publishedDataset.create).toNotHaveBeenCalled();
        });
    });
});
