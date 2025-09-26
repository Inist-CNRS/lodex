// @ts-expect-error TS(2792): Cannot find module 'inist-ark'. Did you mean to se... Remove this comment to see the full error message
import InistArk from 'inist-ark';

import getFromArkUri from './ark';

describe('ark routes', () => {
    describe('getFromArkUri', () => {
        it('should call next if uri does not match an ark URI', async () => {
            const ctx = {
                path: 'another_api_route',
                query: {},
                status: 200,
            };
            const next = jest.fn();
            await getFromArkUri(ctx, next);
            expect(ctx.status).toBe(200);
            expect(next).toHaveBeenCalled();
        });

        it('should return 404 if the ARK URI is invalid (InistArk validation)', async () => {
            const ctx = {
                path: 'ark:/67375/39A-B2GXG1TW-8',
                query: {},
                status: 200,
            };

            await getFromArkUri(ctx, () => {});
            expect(ctx.status).toBe(404);
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
                    findByUri: jest.fn().mockImplementation(() => ({
                        id: 'foo',
                    })),
                },
                query: {},
                status: 200,
            };

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            await getFromArkUri(ctx);
            expect(ctx.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({ id: 'foo' });
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(uri);
        });

        it('should return the data for the identifier in the uri query parameter', async () => {
            const ctx = {
                path: 'foo',
                publishedDataset: {
                    findByUri: jest.fn().mockImplementation(() => ({
                        id: 'foo',
                    })),
                },
                query: { uri: 'ark_custom_uri' },
                status: 200,
            };

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            await getFromArkUri(ctx);
            expect(ctx.status).toBe(200);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({ id: 'foo' });
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(
                'ark_custom_uri',
            );
        });
    });
});
