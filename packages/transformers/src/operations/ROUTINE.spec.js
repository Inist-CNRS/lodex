import ROUTINE from './ROUTINE';

describe('ROUTINE', () => {
    it('should return ROUTINE from args', async () => {
        const transformer = ROUTINE(null, [
            {
                name: 'routine',
                value: 'a custom routine',
            },
        ]);

        expect(await transformer()).toEqual('a custom routine');
    });

    it('should return error if args are not defined', async () => {
        const transformer = ROUTINE(null, []);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for ROUTINE transformation',
        );
    });

    it('should return error if args routine is an empty string', async () => {
        const transformer = ROUTINE(null, [
            {
                name: 'routine',
                value: '',
            },
        ]);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for ROUTINE transformation',
        );
    });

    it('should return error if args routine is undefined', async () => {
        const transformer = ROUTINE(null, [
            {
                name: 'routine',
                value: undefined,
            },
        ]);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for ROUTINE transformation',
        );
    });
});
