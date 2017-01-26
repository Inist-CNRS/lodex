import expect from 'expect';
import { validateField } from './field';

describe.only('field', () => {
    describe('validateField', () => {
        it('should return field if valid', () => {
            const field = {
                name: 'name',
                label: 'label',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };
            expect(validateField(field)).toEqual(field);
        });

        it('should return field if no transformers', () => {
            const field = {
                name: 'name',
                label: 'label',
                transformers: [],
            };
            expect(validateField(field)).toEqual(field);
        });

        it('should throw an error if no name', () => {
            const field = {
                name: undefined,
                label: 'label',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            expect(() => validateField(field))
                .toThrow('Invalid data for field need a name, label and transformers array');
        });

        it('should throw an error if name less than ', () => {
            const field = {
                name: 'na',
                label: 'label',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                ],
            };

            expect(() => validateField(field))
                .toThrow('Invalid data for field need a name, label and transformers array');
        });

        it('should throw an error if transformer has no args', () => {
            const field = {
                name: 'field',
                label: 'label',
                transformers: [
                    { operation: 'COLUMN' },
                ],
            };
            expect(() => validateField(field)).toThrow(
`Invalid transformer in field at index: 0,
transformer must have a valid operation and an args array`,
            );
        });

        it('should throw an error if transformer operation has unknow operation', () => {
            const field = {
                name: 'field',
                label: 'label',
                transformers: [
                    { operation: 'COLUMN', args: [] },
                    { operation: 'UNKNOWN', args: [] },
                ],
            };
            expect(() => validateField(field)).toThrow(
`Invalid transformer in field at index: 1,
transformer must have a valid operation and an args array`,
            );
        });
    });
});
