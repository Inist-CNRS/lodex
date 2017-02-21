import expect from 'expect';

import { uploadMiddleware } from './upload';

describe('upload', () => {
    it('should set status to 500 and body to error message if parsing throw an error', async () => {
        const ctx = {
            request: {
                header: {
                    'content-type': 'text/csv',
                },
            },
            dataset: {
                remove: () => Promise.resolve(),
                count: () => Promise.resolve('dataset count'),
            },
            getParser: () => {
                throw new Error('Parsing error');
            },
        };

        await uploadMiddleware(ctx);

        expect(ctx.status).toBe(500);
        expect(ctx.body).toBe('Parsing error');
    });

    it('should call all ctx method in turn and have body set to parser result length', async () => {
        const myParser = () => Promise.resolve({
            name: 'myParser result',
        });
        const myStream = {
            put: buffer => expect(buffer).toBe('buffer'),
            stop() {},
        };
        const ctx = {
            request: {
                header: {
                    'content-type': 'text/csv',
                },
            },
            dataset: {
                remove: () => Promise.resolve(),
                insertBatch: (documents) => {
                    expect(documents).toEqual({
                        name: 'myParser result',
                    });
                },
                count: () => Promise.resolve('dataset count'),
            },
            getParser: (type) => {
                expect(type).toBe('text/csv');
                return myParser;
            },
            req: 'req',
            rawBody: (req) => {
                expect(req).toBe('req');
                return Promise.resolve('buffer');
            },
            ReadableStreamBuffer: () => myStream,
        };

        await uploadMiddleware(ctx);

        expect(ctx.body).toEqual({
            totalLines: 'dataset count',
        });
    });
});
