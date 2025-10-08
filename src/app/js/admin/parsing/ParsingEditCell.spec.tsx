import { getValueBySavingType } from './ParsingEditCell';

describe('<ParsingEditCell />', () => {
    describe('getValueBySavingType()', () => {
        it('getValueBySavingType() with type number', () => {
            // @ts-expect-error TS2554
            expect(getValueBySavingType('123', 'number')).toBe(123);
            // @ts-expect-error TS2554
            expect(() => getValueBySavingType('hello', 'number')).toThrow(
                'value_not_a_number',
            );
        });

        it('getValueBySavingType() with type string', () => {
            // @ts-expect-error TS2554
            expect(getValueBySavingType('hello', 'string')).toBe('hello');
            expect(
                // @ts-expect-error TS2554
                getValueBySavingType('{"hello": "world"}', 'string'),
            ).toEqual(JSON.stringify('{"hello": "world"}'));
        });

        it('getValueBySavingType() with type boolean', () => {
            // @ts-expect-error TS2554
            expect(getValueBySavingType('true', 'boolean')).toBe(true);
            // @ts-expect-error TS2554
            expect(getValueBySavingType('false', 'boolean')).toBe(false);
        });

        it('getValueBySavingType() with type array', () => {
            // @ts-expect-error TS2554
            expect(getValueBySavingType('[1, 2, 3]', 'array')).toEqual([
                1, 2, 3,
            ]);
            // @ts-expect-error TS2554
            expect(() => getValueBySavingType('hello', 'array')).toThrow(
                'value_not_an_array',
            );
        });

        it('getValueBySavingType() with type json', () => {
            expect(
                // @ts-expect-error TS2554
                getValueBySavingType('{"hello": "world"}', 'object'),
            ).toEqual({
                hello: 'world',
            });
            // @ts-expect-error TS2554
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
