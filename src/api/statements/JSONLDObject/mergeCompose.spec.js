import expect from 'expect';
import mergeCompose from './mergeCompose';

describe('JSONLDObject / mergeCompose', () => {
    it('should throw when no parameters', async () => {
        try {
            mergeCompose();
        } catch (e) {
            expect(e).toExist();
        }
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
        const fields = [{
            name: 'component1',
            scheme: 'http://component1.scheme',
        }, {
            name: 'component2',
            scheme: 'http://component2.scheme',
        }];
        const res = mergeCompose(output, field, data, fields);
        expect(res).toExist();
        expect(res).toEqual({
            '@context': {
                component1: { '@id': 'http://component1.scheme' },
                component2: { '@id': 'http://component2.scheme' },
                composed: { '@id': 'http://composed.scheme' },
                label: { '@id': 'https://www.w3.org/2000/01/rdf-schema#label' },
            },
            composed: [{
                '@id': 'http://uri/compose/composed',
                '@type': ['composedClass'],
                component1: 'component1 value',
            }, {
                '@id': 'http://uri/compose/composed',
                '@type': ['composedClass'],
                component2: 'component2 value',
            }],
        });
        // Expected triples:
        // <http://uri/compose/composed> <http://component1.scheme> "component1 value" .
        // <http://uri/compose/composed> <http://component2.scheme> "component2 value" .
        // <http://uri/compose/composed> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://json-ld.org/playground/composedClass> .
        // _:b0 <http://composed.scheme> <http://uri/compose/composed> .
    });
});
