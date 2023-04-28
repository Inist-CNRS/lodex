import mergeClasses from '../src/JSONLDObject/mergeClasses';

describe('JSONLDObject / mergeClasses', () => {
    it('should throw when no parameters given', () => {
        try {
            const output = mergeClasses();
            expect(output).toBeFalsy();
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it('should throw when no "output" given', () => {
        try {
            const output = mergeClasses(
                undefined,
                { name: 'field', classes: [] },
                { uri: 'a' },
            );
            expect(output).toBeFalsy();
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it('should throw when no "field" given', () => {
        try {
            const output = mergeClasses({}, undefined, { uri: 'a' });
            expect(output).toBeFalsy();
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it('should throw when no "data" given', () => {
        try {
            const output = mergeClasses(
                {},
                { name: 'field', classes: [] },
                undefined,
            );
            expect(output).toBeFalsy();
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it('should not throw when all parameters are given', () => {
        const output = mergeClasses(
            {},
            { name: 'field', classes: [] },
            { uri: 'a' },
        );
        expect(output).toBeTruthy();
    });

    it('should return JSON-LD', () => {
        const output = mergeClasses(
            {},
            { name: 'uri', classes: ['class'], scheme: 'http://scheme' },
            { uri: 'a' },
        );
        expect(output).toEqual({
            '@context': {
                label: {
                    '@id': 'http://www.w3.org/2000/01/rdf-schema#label',
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
            {},
            {
                name: 'uri',
                classes: ['class1', 'class2'],
                scheme: 'http://scheme',
            },
            { uri: 'a' },
        );
        expect(output).toEqual({
            '@context': {
                label: {
                    '@id': 'http://www.w3.org/2000/01/rdf-schema#label',
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

    it('should return JSON-LD when no data.uri is given', () => {
        const output = mergeClasses(
            {},
            { name: 'uri', classes: ['class'], scheme: 'http://scheme' },
            {},
            'http://data.istex.fr',
        );
        expect(output).toEqual({
            '@context': {
                label: {
                    '@id': 'http://www.w3.org/2000/01/rdf-schema#label',
                },
                uri: {
                    '@id': 'http://scheme',
                },
            },
            uri: {
                '@id': 'http://data.istex.fr/#classes/uri',
                '@type': ['class'],
                label: undefined,
            },
        });
    });
});
