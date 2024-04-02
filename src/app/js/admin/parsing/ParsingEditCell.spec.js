import { getValueBySavingType } from './ParsingEditCell';

describe('<ParsingEditCell />', () => {
    describe('getValueBySavingType()', () => {
        it('getValueBySavingType() with type number', () => {
            expect(getValueBySavingType('123', 'number')).toBe(123);
            expect(() => getValueBySavingType('hello', 'number')).toThrow(
                'value_not_a_number',
            );
        });

        it('getValueBySavingType() with type string', () => {
            expect(getValueBySavingType('hello', 'string')).toBe('hello');
            expect(
                getValueBySavingType('{"hello": "world"}', 'string'),
            ).toEqual(JSON.stringify('{"hello": "world"}'));
        });

        it('getValueBySavingType() with type boolean', () => {
            expect(getValueBySavingType('true', 'boolean')).toBe(true);
            expect(getValueBySavingType('false', 'boolean')).toBe(false);
        });

        it('getValueBySavingType() with type array', () => {
            expect(getValueBySavingType('[1, 2, 3]', 'array')).toEqual([
                1, 2, 3,
            ]);
            expect(() => getValueBySavingType('hello', 'array')).toThrow(
                'value_not_an_array',
            );
        });

        it('getValueBySavingType() with type json', () => {
            expect(
                getValueBySavingType('{"hello": "world"}', 'object'),
            ).toEqual({
                hello: 'world',
            });
            expect(() => getValueBySavingType('hello', 'object')).toThrow(
                'value_not_an_object',
            );
        });

        it('getValueBySavingType() with no type provided', () => {
            expect(getValueBySavingType('hello', undefined, 123)).toBeNaN();
            expect(getValueBySavingType('true', undefined, false)).toBe(true);
            expect(
                getValueBySavingType('{"hello": "world"}', undefined, {}),
            ).toEqual(JSON.stringify('{"hello": "world"}'));
        });
    });
});
