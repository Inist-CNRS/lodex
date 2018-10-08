import memoizeTransformer from './memoizeTransformer';

describe('memoizeTransfomer', () => {
    const configuredTransformer = jest.fn().mockImplementation(() => 'result');
    const transformer = jest
        .fn()
        .mockImplementation(() => configuredTransformer);

    it('should call configuredTransformer only the first time', () => {
        const memoized = memoizeTransformer(transformer);
        memoized('context', ['args'])({ doc: 'data' });
        expect(transformer).toHaveBeenCalledWith('context', ['args']);
        expect(configuredTransformer).toHaveBeenCalledWith({ doc: 'data' });
        transformer.mockClear();
        configuredTransformer.mockClear();
        memoized('context', ['args'])({ doc: 'data' });
        expect(transformer).not.toHaveBeenCalled();
        expect(configuredTransformer).not.toHaveBeenCalled();
    });
});
