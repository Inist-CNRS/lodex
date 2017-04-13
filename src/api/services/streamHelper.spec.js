import expect, { createSpy } from 'expect';

import { append, concatStreamsFactory } from './streamHelper';

describe.only('streamHepler', () => {
    describe('append', () => {
        it('should call readStream.pipe with writeStream and on and resolve ', async () => {
            const readStream = {
                pipe: createSpy(),
                on: createSpy((type, fn) => {
                    if (type === 'end') {
                        fn();
                    }
                }).andCallThrough(),
            };
            await append('writeStream')(readStream);

            expect(readStream.pipe).toHaveBeenCalledWith('writeStream', { end: false });
            expect(readStream.on).toHaveBeenCalled();
        });

        it('should resolve with value passed to resolve fn passed to on end', async () => {
            const readStream = {
                pipe: createSpy(),
                on: createSpy((type, fn) => {
                    if (type === 'end') {
                        fn('on end');
                    }
                }).andCallThrough(),
            };
            const result = await append('writeStream')(readStream);

            expect(result).toBe('on end');
        });

        it('should reject with value passed to reject fn passed to on error', async () => {
            const error = new Error('on error');
            const readStream = {
                pipe: createSpy(),
                on: createSpy((type, fn) => {
                    if (type === 'error') {
                        fn(error);
                    }
                }).andCallThrough(),
            };
            const result = await append('writeStream')(readStream).catch(e => e);

            expect(result).toBe(error);
        });
    });

    describe('concatStreamsFactory', () => {
        it('should call append with resultStream and appendTo with each sourceStream', async () => {
            const appendTo = createSpy();
            const appendImpl = createSpy().andReturn(appendTo);

            await concatStreamsFactory(appendImpl)(['source1', 'source2', 'source3'], 'resultStream');
            expect(appendImpl).toHaveBeenCalledWith('resultStream');
            expect(appendTo).toHaveBeenCalledWith('source1', 0, ['source1', 'source2', 'source3']);
            expect(appendTo).toHaveBeenCalledWith('source2', 1, ['source1', 'source2', 'source3']);
            expect(appendTo).toHaveBeenCalledWith('source3', 2, ['source1', 'source2', 'source3']);
        });
    });
});
