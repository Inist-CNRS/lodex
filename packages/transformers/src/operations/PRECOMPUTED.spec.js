import PRECOMPUTED from './PRECOMPUTED';

describe('PRECOMPUTED', () => {
    it('should return precomputed from args', async () => {
        const transformer = PRECOMPUTED(null, [
            {
                name: 'precomputed',
                value: 'a custom precomputed',
            },
            {
                name: 'routine',
                value: 'a custom routine',
            },
        ]);

        expect(await transformer()).toEqual({
            precomputed: 'a custom precomputed',
            routine: 'a custom routine',
        });
    });

    it('should return error if args are not defined', async () => {
        const transformer = PRECOMPUTED(null, []);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for PRECOMPUTED transformation',
        );
    });

    it('should return error if args precomputed is an empty string', async () => {
        const transformer = PRECOMPUTED(null, [
            {
                name: 'precomputed',
                value: '',
            },
            {
                name: 'routine',
                value: '',
            },
        ]);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for PRECOMPUTED transformation',
        );
    });

    it('should return error if args precomputed is undefined', async () => {
        const transformer = PRECOMPUTED(null, [
            {
                name: 'precomputed',
                value: undefined,
            },
            {
                name: 'routine',
                value: undefined,
            },
        ]);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for PRECOMPUTED transformation',
        );
    });
});
