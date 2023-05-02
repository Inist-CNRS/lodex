import mergeCompose from '../src/JSONLDObject/mergeCompose';

describe('JSONLDObject / mergeCompose', () => {
    it('should throw when no parameters', () => {
        expect(() => {
            mergeCompose();
        }).toThrowError();
    });

    it('should work well with a class', () => {
        const output = {};
        const field = {
            name: 'composed',
            composedOf: {
                fields: ['component1', 'component2'],
            },
            scheme: 'http://composed.scheme',
            classes: ['composedClass'],
        };
        const data = {
            uri: 'http://uri',
            component1: 'component1 value',
            component2: 'component2 value',
        };
        const fields = [
            {
                name: 'component1',
                scheme: 'http://component1.scheme',
            },
            {
                name: 'component2',
                scheme: 'http://component2.scheme',
            },
        ];
        const res = mergeCompose(output, field, data, fields);
        expect(res).toBeTruthy();
        expect(res).toEqual({
            '@context': {
                component1: { '@id': 'http://component1.scheme' },
                component2: { '@id': 'http://component2.scheme' },
                composed: { '@id': 'http://composed.scheme' },
                label: { '@id': 'http://www.w3.org/2000/01/rdf-schema#label' },
            },
            composed: [
                {
                    '@id': 'http://uri#compose/composed',
                    '@type': ['composedClass'],
                    component1: 'component1 value',
                },
                {
                    '@id': 'http://uri#compose/composed',
                    '@type': ['composedClass'],
                    component2: 'component2 value',
                },
            ],
        });
        // Expected triples:
        // <http://uri/compose/composed> <http://component1.scheme> "component1 value" .
        // <http://uri/compose/composed> <http://component2.scheme> "component2 value" .
        // <http://uri/compose/composed> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://json-ld.org/playground/composedClass> .
        // _:b0 <http://composed.scheme> <http://uri/compose/composed> .
    });

    it('should work without scheme in fields', () => {
        const output = {};
        const field = {
            name: 'composed',
            composedOf: {
                fields: ['component1', 'component2'],
            },
            scheme: 'http://composed.scheme',
            classes: ['composedClass'],
        };
        const data = {
            uri: 'http://uri',
            component1: 'component1 value',
            component2: 'component2 value',
        };
        const fields = [
            {
                name: 'component1',
            },
            {
                name: 'component2',
            },
        ];
        const res = mergeCompose(output, field, data, fields);
        expect(res).toBeTruthy();
        expect(res).toEqual({
            '@context': {
                composed: { '@id': 'http://composed.scheme' },
                label: { '@id': 'http://www.w3.org/2000/01/rdf-schema#label' },
            },
            composed: [null, null],
        });
    });

    it('should work without finding one component field', () => {
        const output = {};
        const field = {
            name: 'composed',
            composedOf: {
                fields: ['component1', 'component2'],
            },
            scheme: 'http://composed.scheme',
            classes: ['composedClass'],
        };
        const data = {
            uri: 'http://uri',
            component1: 'component1 value',
            component2: 'component2 value',
        };
        const fields = [
            {
                name: 'unknownComponent',
                scheme: 'http://component1.scheme',
            },
            {
                name: 'component2',
                scheme: 'http://component2.scheme',
            },
        ];
        const res = mergeCompose(output, field, data, fields);
        expect(res).toBeTruthy();
        expect(res).toEqual({
            '@context': {
                component2: { '@id': 'http://component2.scheme' },
                composed: { '@id': 'http://composed.scheme' },
                label: { '@id': 'http://www.w3.org/2000/01/rdf-schema#label' },
            },
            composed: [
                null,
                {
                    '@id': 'http://uri#compose/composed',
                    '@type': ['composedClass'],
                    component2: 'component2 value',
                },
            ],
        });
    });

    it('should work with component having class', () => {
        const output = {};
        const field = {
            name: 'composed',
            composedOf: {
                fields: ['component1', 'component2'],
            },
            scheme: 'http://composed.scheme',
            classes: ['composedClass'],
        };
        const data = {
            uri: 'http://uri',
            component1: 'component1 value',
            component2: 'component2 value',
        };
        const fields = [
            {
                name: 'component1',
                scheme: 'http://component1.scheme',
                classes: ['componentClass'],
            },
            {
                name: 'component2',
                scheme: 'http://component2.scheme',
            },
        ];
        const res = mergeCompose(output, field, data, fields);
        expect(res).toBeTruthy();
        expect(res).toEqual({
            '@context': {
                component1: { '@id': 'http://component1.scheme' },
                component2: { '@id': 'http://component2.scheme' },
                composed: { '@id': 'http://composed.scheme' },
                label: { '@id': 'http://www.w3.org/2000/01/rdf-schema#label' },
            },
            composed: [
                {
                    '@id': 'http://uri#compose/composed',
                    '@type': ['composedClass'],
                    component1: {
                        '@id': 'http://uri#classes/composed/component1',
                        '@type': ['componentClass'],
                        label: 'component1 value',
                    },
                },
                {
                    '@id': 'http://uri#compose/composed',
                    '@type': ['composedClass'],
                    component2: 'component2 value',
                },
            ],
        });
    });

    it('should work with scheme without classes', () => {
        const output = {};
        const field = {
            name: 'composed',
            composedOf: {
                fields: ['component1', 'component2'],
            },
            scheme: 'http://composed.scheme',
        };
        const data = {
            uri: 'http://uri',
            component1: 'component1 value',
            component2: 'component2 value',
        };
        const fields = [
            {
                name: 'component1',
                scheme: 'http://component1.scheme',
            },
            {
                name: 'component2',
                scheme: 'http://component2.scheme',
            },
        ];
        const res = mergeCompose(output, field, data, fields);
        expect(res).toBeTruthy();
        expect(res).toEqual({
            '@context': {
                component1: { '@id': 'http://component1.scheme' },
                component2: { '@id': 'http://component2.scheme' },
                composed: { '@id': 'http://composed.scheme' },
                label: { '@id': 'http://www.w3.org/2000/01/rdf-schema#label' },
            },
            composed: [
                {
                    '@id': 'http://uri#compose/composed',
                    '@type': [],
                    component1: 'component1 value',
                },
                {
                    '@id': 'http://uri#compose/composed',
                    '@type': [],
                    component2: 'component2 value',
                },
            ],
        });
    });
});
