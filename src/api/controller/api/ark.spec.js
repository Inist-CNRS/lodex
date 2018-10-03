import expect, { createSpy } from 'expect';
import InistArk from 'inist-ark';

import getFromArkUri from './ark';

describe('ark routes', () => {
    describe('getFromArkUri', () => {
        it('should return 404 if uri does not match an ark URI', async () => {
            const ctx = {
                path: 'invalid uri',
                query: {},
                status: 200,
            };
            await getFromArkUri(ctx);
            expect(ctx.status).toEqual(404);
        });

        it('should return 404 if the ARK URI is invalid (InistArk validation)', async () => {
            const ctx = {
                path: 'ark:/67375/39A-B2GXG1TW-8',
                query: {},
                status: 200,
            };

            await getFromArkUri(ctx, () => {});
            expect(ctx.status).toEqual(404);
        });

        it('should return the data for the requested ARK URI', async () => {
            const ark = new InistArk({
                naan: '67375',
                query: {},
                subpublisher: '39D',
            });

            const uri = ark.generate();
            const ctx = {
                path: uri,
                publishedDataset: {
                    findByUri: createSpy().andReturn({ id: 'foo' }),
                },
                query: {},
                status: 200,
            };

            await getFromArkUri(ctx);
            expect(ctx.status).toEqual(200);
            expect(ctx.body).toEqual({ id: 'foo' });
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(uri);
        });

        it('should return the data for the identifier in the uri query parameter', async () => {
            const ctx = {
                path: 'foo',
                publishedDataset: {
                    findByUri: createSpy().andReturn({ id: 'foo' }),
                },
                query: { uri: 'ark_custom_uri' },
                status: 200,
            };

            await getFromArkUri(ctx);
            expect(ctx.status).toEqual(200);
            expect(ctx.body).toEqual({ id: 'foo' });
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(
                'ark_custom_uri',
            );
        });

        it('should prefetch data for value if applyFormat is true', async () => {
            const ctx = {
                path: 'foo',
                publishedDataset: {
                    findByUri: createSpy().andReturn({
                        id: 'foo',
                        versions: [
                            'version1',
                            {
                                field_with_prefetch1: 'issn_value',
                                field_with_prefetch2: 'some_value',
                            },
                        ],
                    }),
                },
                query: { uri: 'ark_custom_uri', applyFormat: true },
                status: 200,
                field: {
                    findPrefetchResourceFields: createSpy().andReturn(
                        Promise.resolve([
                            {
                                name: 'field_with_prefetch1',
                                format: {
                                    args: {
                                        prefetch:
                                            'https://api.istex.fr/document/?q=(host.issn%3A%22__VALUE__%22)size=10&output=*',
                                    },
                                },
                            },
                            {
                                name: 'field_with_prefetch2',
                                format: {
                                    args: {
                                        prefetch:
                                            'https://api.istex.fr/__VALUE__',
                                    },
                                },
                            },
                        ]),
                    ),
                },
                prefetchFormatData: createSpy().andReturn(
                    Promise.resolve('prefetched data'),
                ),
            };

            await getFromArkUri(ctx);
            expect(ctx.status).toEqual(200);
            expect(ctx.body).toEqual({
                id: 'foo',
                versions: [
                    'version1',
                    {
                        field_with_prefetch1: 'issn_value',
                        field_with_prefetch2: 'some_value',
                    },
                ],
                prefetchedData: 'prefetched data',
            });
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(
                'ark_custom_uri',
            );
            expect(ctx.field.findPrefetchResourceFields).toHaveBeenCalled();
            expect(ctx.prefetchFormatData).toHaveBeenCalledWith(
                [
                    {
                        name: 'field_with_prefetch1',
                        format: {
                            args: {
                                prefetch:
                                    'https://api.istex.fr/document/?q=(host.issn%3A%22__VALUE__%22)size=10&output=*',
                            },
                        },
                    },
                    {
                        name: 'field_with_prefetch2',
                        format: {
                            args: {
                                prefetch: 'https://api.istex.fr/__VALUE__',
                            },
                        },
                    },
                ],
                {
                    field_with_prefetch1: 'issn_value',
                    field_with_prefetch2: 'some_value',
                },
            );
        });

        it('should not prefetch data for value if applyFormat is true but there is no prefetch field', async () => {
            const ctx = {
                path: 'foo',
                publishedDataset: {
                    findByUri: createSpy().andReturn({
                        id: 'foo',
                        versions: [
                            'version1',
                            {
                                field_with_prefetch1: 'issn_value',
                                field_with_prefetch2: 'some_value',
                            },
                        ],
                    }),
                },
                query: { uri: 'ark_custom_uri', applyFormat: true },
                status: 200,
                field: {
                    findPrefetchResourceFields: createSpy().andReturn(
                        Promise.resolve([]),
                    ),
                },
                fetch: createSpy().andReturn(
                    Promise.resolve('prefetched data'),
                ),
            };

            await getFromArkUri(ctx);
            expect(ctx.status).toEqual(200);
            expect(ctx.body).toEqual({
                id: 'foo',
                versions: [
                    'version1',
                    {
                        field_with_prefetch1: 'issn_value',
                        field_with_prefetch2: 'some_value',
                    },
                ],
            });
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(
                'ark_custom_uri',
            );
            expect(ctx.field.findPrefetchResourceFields).toHaveBeenCalled();
            expect(ctx.fetch).toNotHaveBeenCalled();
            expect(ctx.fetch).toNotHaveBeenCalled();
        });
    });
});
