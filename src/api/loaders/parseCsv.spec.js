import { Readable } from 'stream';
import expect from 'expect';

import parseCsv from './parseCsv';

const getStream = (text) => {
    const stream = new Readable();
    stream.push(text);
    stream.push(null);
    return stream;
};

describe('parseCsv', () => {
    it('should return document based on received csv Stream', async () => {
        const stream = getStream(
`a;b;c
1;2;3
4;"hello\nworld";6`,
        );
        expect(await parseCsv({
            delimiter: ';',
        })(stream)).toEqual([{
            a: '1',
            b: '2',
            c: '3',
        }, {
            a: '4',
            b: 'hello\nworld',
            c: '6',
        }]);
    });

    it('should return errors for failed row', async () => {
        const stream = getStream(
`a;b;c
1;2;3
4;5;6;7
8;9;10`,
        );

        let error;
        try {
            await parseCsv({
                delimiter: ';',
            })(stream);
        } catch (e) {
            error = e;
        }

        expect(error.message).toBe('Number of columns on line 3 does not match header');
    });
});
