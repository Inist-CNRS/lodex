import expect from 'expect';
import mergeSimpleField from './mergeSimpleField';

describe('JSONLDObject / mergeSimpleField', () => {
    it('should throw when no parameters', async () => {
        try {
            mergeSimpleField();
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should create a context', () => {
        const output = {};
        const field = {
            name: 'fieldName',
            scheme: 'fieldScheme',
            type: 'fieldType',
            language: 'fieldLanguage',
        };
        const data = {
            fieldName: 'field value',
        };
        expect(mergeSimpleField(output, field, data)).toEqual({
            '@context': {
                fieldName: {
                    '@id': 'fieldScheme',
                    '@language': 'fieldLanguage',
                    '@type': 'fieldType',
                },
            },
            fieldName: 'field value',
        });
    });

    it('should work without type', () => {
        const output = {};
        const field = {
            name: 'fieldName',
            scheme: 'fieldScheme',
            language: 'fieldLanguage',
        };
        const data = {
            fieldName: 'field value',
        };
        expect(mergeSimpleField(output, field, data)).toEqual({
            '@context': {
                fieldName: {
                    '@id': 'fieldScheme',
                    '@language': 'fieldLanguage',
                },
            },
            fieldName: 'field value',
        });
    });

    it('should work without language', () => {
        const output = {};
        const field = {
            name: 'fieldName',
            scheme: 'fieldScheme',
            type: 'fieldType',
        };
        const data = {
            fieldName: 'field value',
        };
        expect(mergeSimpleField(output, field, data)).toEqual({
            '@context': {
                fieldName: {
                    '@id': 'fieldScheme',
                    '@type': 'fieldType',
                },
            },
            fieldName: 'field value',
        });
    });

    it('should not work well without the right field name', () => {
        const output = {};
        const field = {
            name: 'fieldName',
            scheme: 'fieldScheme',
            type: 'fieldType',
            language: 'fieldLanguage',
        };
        const data = {
            otherFieldName: 'other field value',
        };
        expect(mergeSimpleField(output, field, data)).toEqual({
            '@context': {
                fieldName: {
                    '@id': 'fieldScheme',
                    '@language': 'fieldLanguage',
                    '@type': 'fieldType',
                },
            },
            fieldName: undefined,
        });
    });

    it('should append to the output', () => {
        const output = {
            anything: 'else',
        };
        const field = {
            name: 'fieldName',
            scheme: 'fieldScheme',
            type: 'fieldType',
            language: 'fieldLanguage',
        };
        const data = {
            fieldName: 'field value',
        };
        expect(mergeSimpleField(output, field, data)).toEqual({
            '@context': {
                fieldName: {
                    '@id': 'fieldScheme',
                    '@language': 'fieldLanguage',
                    '@type': 'fieldType',
                },
            },
            anything: 'else',
            fieldName: 'field value',
        });
    });
});
