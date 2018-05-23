import assert from 'assert';
import Script from './script';

describe('script ', () => {
    const routine = new Script('routines');

    it('should be localy exists', async () => {
        const current = await routine.get('distinct-by');
        assert.equal(current.length, 4);
    });
    it('should be remotely exists', async () => {
        const current = await routine.get('hello-world');
        assert.equal(current.length, 4);
    });
    it('should be notexists', async () => {
        const current = await routine.get('fake-world');
        assert.equal(current, undefined);
    });
});
