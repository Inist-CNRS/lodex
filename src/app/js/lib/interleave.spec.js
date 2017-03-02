import expect from 'expect';

import interleave from './interleave';

describe.only('interleave', () => {
    it('should interleave all item in array with separator', () => {
        expect(interleave([
            'item1', 'item2', 'item3',
        ], 'separator')).toEqual(['item1', 'separator', 'item2', 'separator', 'item3']);
    });

    it('should return empty array when receiving an empty array', () => {
        expect(interleave([], 'separator'))
            .toEqual([]);
    });
});
