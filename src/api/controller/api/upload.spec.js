import expect, { createSpy } from 'expect';

import { uploadMiddleware } from './upload';

describe('upload', () => {
    it('should set status to 500 and body to error message if parsing throw an error', async () => {
        const ctx = {
            dataset: {
                remove: createSpy(),
                count: () => createSpy().andReturn(Promise.resolve('dataset count')),
            },
            getParser: createSpy().andThrow(new Error('Parsing error')),
        };

        await uploadMiddleware(ctx, 'csv');

        expect(ctx.status).toBe(500);
        expect(ctx.body).toBe('Parsing error');
    });

    it('should call all ctx method in turn and have body set to parser result length', async () => {
        const myParser = createSpy().andReturn(Promise.resolve({
            name: 'myParser result',
        }));
        const ctx = {
            dataset: {
                remove: createSpy(),
                insertBatch: createSpy(),
                count: createSpy().andReturn(Promise.resolve('dataset count')),
            },
            getParser: createSpy().andReturn(myParser),
            req: 'req',
            requestToStream: createSpy().andReturn(Promise.resolve('stream')),
            streamToArray: createSpy().andReturn('documents'),
        };

        await uploadMiddleware(ctx, 'csv');

        expect(ctx.dataset.remove).toHaveBeenCalledWith({});
        expect(ctx.getParser).toHaveBeenCalledWith('csv');
        expect(ctx.requestToStream).toHaveBeenCalledWith('req');
        expect(myParser).toHaveBeenCalledWith('stream');
        expect(ctx.streamToArray).toHaveBeenCalledWith({
            name: 'myParser result',
        });
        expect(ctx.dataset.count).toHaveBeenCalled();
        expect(ctx.body).toEqual({
            totalLines: 'dataset count',
        });
    });
});
