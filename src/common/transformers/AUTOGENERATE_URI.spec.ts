// @ts-expect-error TS(2792): Cannot find module 'inist-ark'. Did you mean to se... Remove this comment to see the full error message
import InistArk from 'inist-ark';

import { autoGenerateUri } from './AUTOGENERATE_URI';

describe('AUTOGENERATE_URI', () => {
    it('should generate a valid ark with naan and publisherId from config', async () => {
        const arkUri = await autoGenerateUri({
            naan: '67375',
            subpublisher: '39D',
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
        })('newA', 'a')(
            // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
            {
                a: 1,
                b: 2,
            },
            'a',
        );
        const ark = new InistArk({ naan: '67375', subpublisher: '39D' });
        const parsedArk = ark.parse(arkUri);
        expect(parsedArk.naan).toBe('67375');
        expect(parsedArk.subpublisher).toBe('39D');
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
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
        const arkUri = await autoGenerateUri({})('newA', 'a')(
            // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
            {
                a: 1,
                b: 2,
            },
            'a',
        );

        expect(arkUri).toMatch(/[0123456789BCDFGHJKLMNPQRSTVWXZ]{8}/);
    });
});
