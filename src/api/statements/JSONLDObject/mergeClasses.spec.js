import expect from 'expect';
import mergeClasses from './mergeClasses';

describe('JSONLDObject / mergeClasses', () => {
    it('should throw when no parameters given', () => {
        try {
            const output = mergeClasses();
            expect(output).toNotExist();
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no "output" given', () => {
        try {
            const output = mergeClasses(
                undefined,
                { name: 'field', classes: [] },
                { uri: 'a' },
            );
            expect(output).toNotExist();
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no "field" given', () => {
        try {
            const output = mergeClasses(
                {},
                undefined,
                { uri: 'a' },
            );
            expect(output).toNotExist();
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should throw when no "data" given', () => {
        try {
            const output = mergeClasses(
                {},
                { name: 'field', classes: [] },
                undefined,
            );
            expect(output).toNotExist();
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should not throw when all parameters are given', () => {
        const output = mergeClasses(
            {},
            { name: 'field', classes: [] },
            { uri: 'a' },
        );
        expect(output).toExist();
    });

    it('should return JSON-LD', () => {
        const output = mergeClasses(
            { },
            { name: 'uri', classes: ['class'], scheme: 'http://scheme' },
            { uri: 'a' },
        );
        expect(output).toEqual({
            '@context': {
                label: {
                    '@id': 'https://www.w3.org/2000/01/rdf-schema#label',
                },
                uri: {
                    '@id': 'http://scheme',
                },
            },
            uri: {
                '@id': 'http://data.istex.fr/a#classes/uri',
                '@type': ['class'],
                label: 'a',
            },
        });
    });

    it('should return JSON-LD for multiple classes', () => {
        const output = mergeClasses(
            { },
            { name: 'uri', classes: ['class1', 'class2'], scheme: 'http://scheme' },
            { uri: 'a' },
        );
        expect(output).toEqual({
            '@context': {
                label: {
                    '@id': 'https://www.w3.org/2000/01/rdf-schema#label',
                },
                uri: {
                    '@id': 'http://scheme',
                },
            },
            uri: {
                '@id': 'http://data.istex.fr/a#classes/uri',
                '@type': ['class1', 'class2'],
                label: 'a',
            },
        });
    });
});
