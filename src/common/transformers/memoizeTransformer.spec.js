import expect, { createSpy } from 'expect';

import memoizeTransformer from './memoizeTransformer';

describe('memoizeTransfomer', () => {
    const configuredTransformer = createSpy().andReturn('result');
    const transformer = createSpy().andReturn(configuredTransformer);

    it('should call configuredTransformer only the first time', () => {
        const memoized = memoizeTransformer(transformer);
        memoized('context', ['args'])({ doc: 'data' });
        expect(transformer).toHaveBeenCalledWith('context', ['args']);
        expect(configuredTransformer).toHaveBeenCalledWith({ doc: 'data' });
        transformer.reset();
        configuredTransformer.reset();
        memoized('context', ['args'])({ doc: 'data' });
        expect(transformer).toNotHaveBeenCalled();
        expect(configuredTransformer).toNotHaveBeenCalled();
    });
});
