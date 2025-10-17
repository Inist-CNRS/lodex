import assert from 'assert';
import Script from './script';

describe('script(routines)', () => {
    const routine = new Script('routines');

    it('should exist locally', async () => {
        const current = await routine.get('distinct-by');
        assert.equal(current.length, 4);
    });
    it('should not exist', async () => {
        const current = await routine.get('fake-world');
        assert.equal(current, undefined);
    });
});
describe('script(loaders)', () => {
    const loaders = new Script('loaders');

    it('should exist locally', async () => {
        const current = await loaders.get('csv');
        assert.equal(current.length, 4);
    });
});
