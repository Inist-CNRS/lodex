import expect from 'expect';

import smartMap from './smartMap';

describe('smartMap', () => {
    const fn = string => `updated ${string}`;

    it('should return result of fn(value)', () => {
        expect(smartMap(fn)('value')).toBe('updated value');
    });

    it('should return map fn on array', () => {
        expect(smartMap(fn)(['value1', 'value2'])).toEqual([
            'updated value1',
            'updated value2',
        ]);
    });
});
