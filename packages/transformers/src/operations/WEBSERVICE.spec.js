import WEBSERVICE from './WEBSERVICE';

describe('WEBSERVICE', () => {
    it('should return webservice from args', async () => {
        const transformer = WEBSERVICE(null, [
            {
                name: 'webservice',
                value: 'a custom webservice',
            },
        ]);

        expect(await transformer()).toEqual('a custom webservice');
    });

    it('should return error if args are not defined', async () => {
        const transformer = WEBSERVICE(null, []);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for WEBSERVICE transformation',
        );
    });

    it('should return error if args webservice is an empty string', async () => {
        const transformer = WEBSERVICE(null, [
            {
                name: 'webservice',
                value: '',
            },
        ]);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for WEBSERVICE transformation',
        );
    });

    it('should return error if args webservice is undefined', async () => {
        const transformer = WEBSERVICE(null, [
            {
                name: 'webservice',
                value: undefined,
            },
        ]);

        await expect(transformer()).rejects.toThrow(
            'Invalid Argument for WEBSERVICE transformation',
        );
    });
});
