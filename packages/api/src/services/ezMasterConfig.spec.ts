import ezMasterConfig, { validateConfig } from './ezMasterConfig';

describe('ezMasterConfig', () => {
    describe('validateConfig', () => {
        it('should throw if naan is not valid', () => {
            expect(() =>
                validateConfig({
                    username: 'toto',
                    password: 'titi',
                    naan: 'abracadabra',
                }),
            ).toThrow();
        });

        it('should throw if subpublisher is not valid', () => {
            expect(() =>
                validateConfig({
                    username: 'toto',
                    password: 'titi',
                    naan: '555555',
                    subpublisher: 'abracadabra',
                }),
            ).toThrow();
        });

        it('should not throw if config is valid', () => {
            expect(() =>
                validateConfig({
                    username: 'toto',
                    password: 'titi',
                    naan: '555555',
                    subpublisher: 'ABC',
                }),
            ).not.toThrow();
        });
    });

    it('should put ezMasterConfig on the context', async () => {
        const ctx = {};

        await ezMasterConfig(ctx, () => {});

        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(ctx.ezMasterConfig).toBeTruthy();
    });
});
