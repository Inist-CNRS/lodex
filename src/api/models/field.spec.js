import expect from 'expect';
import { INVALID_FIELD_MESSAGE, validateFieldFactory } from './field';

describe('field', () => {
    describe('validateField', () => {
        it('should return field if valid', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };
            expect(validateFieldFactory({ isSchemeValid: () => true })(field)).toEqual(field);
        });

        it('should return field if no transformers', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };
            expect(validateFieldFactory({ isSchemeValid: () => true })(field)).toEqual(field);
        });

        it('should throw an error if no cover', () => {
            const field = {
                cover: undefined,
                label: 'label',
                name: undefined,
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if cover is unknown', () => {
            const field = {
                cover: 'invalid_cover',
                label: 'label',
                name: undefined,
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if no label', () => {
            const field = {
                cover: 'dataset',
                name: 'name',
                label: undefined,
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if label less than ', () => {
            const field = {
                cover: 'dataset',
                label: 'la',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if no name', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: undefined,
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if name less than ', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'na',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if no scheme', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: undefined,
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if scheme is not an URI', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'na',
                scheme: 'scheme',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if schemeService return false', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'na',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => false })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if no type', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'name',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: undefined,
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if type is not an URI', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'na',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
                type: 'invalid_type',
            };

            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field))
                .toThrow(INVALID_FIELD_MESSAGE);
        });

        it('should throw an error if transformer has no args', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'field',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN' },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };
            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field)).toThrow(
`Invalid transformer in field at index: 0,
transformer must have a valid operation and an args array`,
            );
        });

        it('should throw an error if transformer operation has unknow operation', () => {
            const field = {
                cover: 'dataset',
                label: 'label',
                name: 'field',
                scheme: 'http://purl.org/dc/terms/title',
                transformers: [
                    { operation: 'COLUMN', args: [] },
                    { operation: 'UNKNOWN', args: [] },
                ],
                type: 'https://www.w3.org/TR/xmlschema-2/#string',
            };
            expect(() => validateFieldFactory({ isSchemeValid: () => true })(field)).toThrow(
`Invalid transformer in field at index: 1,
transformer must have a valid operation and an args array`,
            );
        });
    });
});
