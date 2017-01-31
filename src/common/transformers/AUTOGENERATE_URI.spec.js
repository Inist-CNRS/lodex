import expect from 'expect';
import InistArk from 'inist-ark';

import AUTOGENERATE_URI from './AUTOGENERATE_URI';

describe('AUTOGENERATE_URI', () => {
    it('should generate a valid ark with naan and publisherId from config', async () => {
        const doc = await AUTOGENERATE_URI({ naan: '67375', subpublisher: '39D' })('newA', 'a')({
            a: 1,
            b: 2,
        }, 'a');
        const ark = new InistArk({ naan: '67375', subpublisher: '39D' });
        const parsedArk = ark.parse(doc.newA);
        expect(parsedArk.naan).toEqual('67375');
        expect(parsedArk.subpublisher).toEqual('39D');
        expect(ark.validate(doc.newA)).toEqual({
            ark: true,
            naan: true,
            name: true,
            subpublisher: true,
            identifier: true,
            checksum: true,
        });
    });

    it('should generate a valid ark identifier when no config supplied', async () => {
        const doc = await AUTOGENERATE_URI({})('newA', 'a')({
            a: 1,
            b: 2,
        }, 'a');

        expect(doc.newA).toMatch(/[0123456789BCDFGHJKLMNPQRSTVWXZ]{8}/);
    });
});
