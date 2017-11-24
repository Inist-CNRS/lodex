import expect from 'expect';
import InistArk from 'inist-ark';

import { autoGenerateUri } from './AUTOGENERATE_URI';

describe('AUTOGENERATE_URI', () => {
    it('should generate a valid ark with naan and publisherId from config', async () => {
        const arkUri = await autoGenerateUri({
            naan: '67375',
            subpublisher: '39D',
        })('newA', 'a')(
            {
                a: 1,
                b: 2,
            },
            'a',
        );
        const ark = new InistArk({ naan: '67375', subpublisher: '39D' });
        const parsedArk = ark.parse(arkUri);
        expect(parsedArk.naan).toEqual('67375');
        expect(parsedArk.subpublisher).toEqual('39D');
        expect(ark.validate(arkUri)).toEqual({
            ark: true,
            naan: true,
            name: true,
            subpublisher: true,
            identifier: true,
            checksum: true,
        });
    });

    it('should generate a valid ark identifier when no config supplied', async () => {
        const arkUri = await autoGenerateUri({})('newA', 'a')(
            {
                a: 1,
                b: 2,
            },
            'a',
        );

        expect(arkUri).toMatch(/[0123456789BCDFGHJKLMNPQRSTVWXZ]{8}/);
    });
});
