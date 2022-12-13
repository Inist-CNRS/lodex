import { getValueBySavingType } from './ParsingEditCell';

describe('<ParsingEditCell />', () => {
    describe('getValueBySavingType()', () => {
        it('getValueBySavingType() with type number', () => {
            expect(getValueBySavingType('123', 'number')).toEqual(123);
            expect(() => getValueBySavingType('hello', 'number')).toThrow(
                'value_not_a_number',
            );
        });

        it('getValueBySavingType() with type string', () => {
            expect(getValueBySavingType('hello', 'string')).toEqual('hello');
            expect(
                getValueBySavingType('{"hello": "world"}', 'string'),
            ).toEqual(JSON.stringify('{"hello": "world"}'));
        });

        it('getValueBySavingType() with type boolean', () => {
            expect(getValueBySavingType('true', 'boolean')).toEqual(true);
            expect(getValueBySavingType('false', 'boolean')).toEqual(false);
        });

        it('getValueBySavingType() with type array', () => {
            expect(getValueBySavingType('[1, 2, 3]', 'array')).toEqual([
                1,
                2,
                3,
            ]);
            expect(() => getValueBySavingType('hello', 'array')).toThrow(
                'value_not_an_array',
            );
        });

        it('getValueBySavingType() with type json', () => {
            expect(getValueBySavingType('{"hello": "world"}', 'json')).toEqual({
                hello: 'world',
            });
            expect(() => getValueBySavingType('hello', 'json')).toThrow(
                'value_not_an_object',
            );
        });

        it('getValueBySavingType() with no type provided', () => {
            expect(getValueBySavingType('hello', undefined, 123)).toEqual(NaN);
            expect(getValueBySavingType('true', undefined, false)).toEqual(
                true,
            );
            expect(
                getValueBySavingType('{"hello": "world"}', undefined, {}),
            ).toEqual(JSON.stringify('{"hello": "world"}'));
        });
    });
});
