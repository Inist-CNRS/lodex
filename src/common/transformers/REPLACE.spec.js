import expect from 'expect';

import { replace } from './REPLACE';

describe('REPLACE', () => {
    it('should return new value from string', () => {
        expect(replace('hello world', 'world', 'you')).toBe('hello you');
    });
});
