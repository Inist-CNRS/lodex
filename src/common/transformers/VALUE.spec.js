import VALUE from './VALUE';

describe('VALUE', () => {
    it('should return value from args', async () => {
        const transformer = VALUE(null, [
            {
                name: 'value',
                value: 'a custom value',
            },
        ]);

        expect(await transformer()).toEqual('a custom value');
    });

    it('should return error if args are not defined', async () => {
        const transformer = VALUE(null, []);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for VALUE transformation',
        );
    });

    it('should return error if args value is an empty string', async () => {
        const transformer = VALUE(null, [
            {
                name: 'value',
                value: '',
            },
        ]);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for VALUE transformation',
        );
    });

    it('should return error if args value is undefined', async () => {
        const transformer = VALUE(null, [
            {
                name: 'value',
                value: undefined,
            },
        ]);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for VALUE transformation',
        );
    });
});
