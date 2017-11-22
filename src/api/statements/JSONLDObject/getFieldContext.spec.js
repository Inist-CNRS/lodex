import expect from 'expect';
import getFieldContext from './getFieldContext';

describe('JSONLDObject / getFieldContext', () => {
    it('should be useless without properties', () => {
        const output = getFieldContext({});
        expect(output).toEqual({ '@id': undefined });
    });

    it('should accept a second parameter', () => {
        const output = getFieldContext({}, 'scheme');
        expect(output).toEqual({ '@id': 'scheme' });
    });

    it('should use scheme property instead of a second parameter', () => {
        const output = getFieldContext({ scheme: 'scheme' });
        expect(output).toEqual({ '@id': 'scheme' });
    });

    it('should take type into account', () => {
        const output = getFieldContext({ scheme: 'scheme', type: 'type' });
        expect(output).toEqual({ '@id': 'scheme', '@type': 'type' });
    });

    it('should take language into account', () => {
        const output = getFieldContext({
            scheme: 'scheme',
            language: 'language',
        });
        expect(output).toEqual({ '@id': 'scheme', '@language': 'language' });
    });

    it('should ignore other subfields', () => {
        const output = getFieldContext({ scheme: 'scheme', other: 'other' });
        expect(output).toEqual({ '@id': 'scheme' });
    });
});
