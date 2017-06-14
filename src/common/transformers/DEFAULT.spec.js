import expect from 'expect';

import { defval } from './DEFAULT';

describe('DEFAULT', () => {
    it('should return default value', () => {
        expect(defval(null, 'Yo')).toBe('Yo');
    });

    it('should return value', () => {
        expect(defval('Ya', 'Yo')).toEqual('Ya');
    });
});
