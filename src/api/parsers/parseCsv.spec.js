import { Readable } from 'stream';
import expect from 'expect';

import parseCsv, { arrayToObject } from './parseCsv';

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
1;2
4;"hello\nworld";6`
        );
        expect(await parseCsv(stream)).toEqual({
            errors: [],
            documents: [{
                a: '1',
                b: '2',
                c: undefined,
            }, {
                a: '4',
                b: 'hello\nworld',
                c: '6',
            }],
        });
    });

    it('should return errors for failed row', async () => {
        const stream = getStream(
`a;b;c
1;2;3
4;5;6;7
8;9;10`
        );
        expect(await parseCsv(stream)).toEqual({
            errors: [{
                data: '4;5;6;7',
                error: 'There is more values than columns',
                line: 3,
            }],
            documents: [{
                a: '1',
                b: '2',
                c: '3',
            }, {
                a: '8',
                b: '9',
                c: '10',
            }],
        });
    });


    describe('arrayToObject', () => {
        it('should convert keys array with values array to create an object', () => {
            expect(arrayToObject(['a', 'b', 'c'], [1, 2, 3])).toEqual({
                a: 1,
                b: 2,
                c: 3,
            });
        });

        it('should keep keys for which there is no value', () => {
            expect(arrayToObject(['a', 'b', 'c'], [1, 2])).toEqual({
                a: 1,
                b: 2,
                c: undefined,
            });
        });

        it('should rename column with no name to `col{index}`', () => {
            expect(arrayToObject(['a', undefined, 'c'], [1, 2, 3])).toEqual({
                a: 1,
                col2: 2,
                c: 3,
            });
        });

        it('should throw an error if more values than keys', () => {
            expect(() => arrayToObject(['a', 'b'], [1, 2, 3])).toThrow('There is more values than columns');
        });
    });
});
