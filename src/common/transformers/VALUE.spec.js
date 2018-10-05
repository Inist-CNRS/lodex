import VALUE from './VALUE';

describe('VALUE', () => {
    it('should return value from args', async () => {
        expect(
            await VALUE(null, [{ name: 'value', value: 'a custom value' }])({}),
        ).toEqual('a custom value');
    });
});
