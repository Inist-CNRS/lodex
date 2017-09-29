import expect from 'expect';
import formatData from './formatData';

describe('JSONLD formatData', () => {
    it('should be undefined when data is a string', () => {
        const output = formatData('http://valid.uri/');
        expect(output).toBe(undefined);
    });

    it('should be undefined when no propertyName is given', () => {
        const output = formatData({ prop: 'http://valid.uri/' });
        expect(output).toBe(undefined);
    });

    it('should add @id', () => {
        const output = formatData({ prop: 'http://valid.uri/' }, 'prop');
        expect(output).toEqual({
            '@id': 'http://valid.uri/',
        });
    });

    it('should be undefined when data is an array, and its items do not contain an uri', () => {
        const output = formatData([{ prop: 'http://valid.uri/' }], 'prop');
        expect(output).toBe(undefined);
    });

    it('should return items when data[prop] is an array, and its items contain an uri', () => {
        const output = formatData({
            prop: [{
                uri: 'http://uri',
            }],
        }, 'prop');
        expect(output).toEqual([{ uri: 'http://uri' }]);
    });

    it('should return transformed item when data[prop] is an array of one URI', () => {
        const output = formatData({
            prop: ['http://uri'],
        }, 'prop');
        expect(output).toEqual([{ '@id': 'http://uri' }]);
    });

    it('should return transformed items when data[prop] is an array of URIs', () => {
        const output = formatData({
            prop: ['http://uri', 'http://valid.uri/'],
        }, 'prop');
        expect(output).toEqual([
            { '@id': 'http://uri' },
            { '@id': 'http://valid.uri/' },
        ]);
    });

    it('should return transformed items when data[prop] is an array of exotic URIs, and data[uri] exists', () => {
        const output = formatData({
            prop: ['ftp://uri', 'ftp://valid.uri/'],
            uri: 'http://uri.param',
        }, 'prop');
        expect(output).toEqual([
            { '@id': 'http://uri.param/ftp://uri' },
            { '@id': 'http://uri.param/ftp://valid.uri/' },
        ]);
    });
});
