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

    it('should', () => {
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
            classes: ['component1Class'],
        }, {
            name: 'component2',
            scheme: 'http://component2.scheme',
            classes: ['component2Class'],
        }];
        const haveClasses = true;
        const res = mergeCompose(output, field, data, fields, haveClasses);
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
                component1: {
                    '@id': 'http://uri/classes/composed/component1',
                    '@type': ['component1Class'],
                    label: 'component1 value',
                },
            }, {
                '@id': 'http://uri/compose/composed',
                '@type': ['composedClass'],
                component2: {
                    '@id': 'http://uri/classes/composed/component2',
                    '@type': ['component2Class'],
                    label: 'component2 value',
                },
            }],
        });
    });
});
