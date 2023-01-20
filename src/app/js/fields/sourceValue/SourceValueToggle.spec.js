import { GET_SOURCE_VALUE_FROM_TRANSFORMERS } from './SourceValueToggle';

describe('SourceValueToggle', () => {
    describe('GET_SOURCE_VALUE_FROM_TRANSFORMERS', () => {
        it('returns correct values for operation VALUE', () => {
            const transformers = [
                { operation: 'VALUE', args: [{ value: 'test' }] },
            ];
            expect(GET_SOURCE_VALUE_FROM_TRANSFORMERS(transformers)).toEqual({
                source: 'arbitrary',
                value: 'test',
            });
        });

        it('returns correct values for operation COLUMN', () => {
            const transformers = [
                { operation: 'COLUMN', args: [{ value: 'columnName' }] },
            ];
            expect(GET_SOURCE_VALUE_FROM_TRANSFORMERS(transformers)).toEqual({
                source: 'fromColumns',
                value: ['columnName'],
            });
        });

        it('returns correct values for operation CONCAT', () => {
            const transformers = [
                {
                    operation: 'CONCAT',
                    args: [{ value: 'a' }, { value: 'b' }, { value: 'c' }],
                },
            ];
            expect(GET_SOURCE_VALUE_FROM_TRANSFORMERS(transformers)).toEqual({
                source: 'fromColumns',
                value: ['a', 'b', 'c'],
            });
        });

        it('returns null values for invalid operation', () => {
            const transformers = [{ operation: 'INVALID', args: [] }];
            expect(GET_SOURCE_VALUE_FROM_TRANSFORMERS(transformers)).toEqual({
                source: null,
                value: null,
            });
        });

        it('returns null values for missing transformers', () => {
            expect(GET_SOURCE_VALUE_FROM_TRANSFORMERS(null)).toEqual({
                source: null,
                value: null,
            });
        });
    });
});
