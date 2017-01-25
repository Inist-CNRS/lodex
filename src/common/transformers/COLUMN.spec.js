import expect from 'expect';

import COLUMN from './COLUMN';

describe('COLUMN', () => {
    it('should take a value from one key and rename it to another keeping only renamed key', async () => {
        expect(await COLUMN('newA', {
            a: 1,
            b: 2,
        }, 'a'))
        .toEqual({
            newA: 1,
        });
    });
});
