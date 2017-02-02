import expect from 'expect';

import COLUMN from './COLUMN';

describe('COLUMN', () => {
    it('should take a value from one key and rename it to another keeping only renamed key', async () => {
        expect(await COLUMN([{ name: 'column', value: 'a' }])({
            a: 'a value',
            b: 'b value',
        }, 'a')).toEqual('a value');
    });
});
