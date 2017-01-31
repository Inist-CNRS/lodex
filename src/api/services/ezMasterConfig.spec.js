import expect from 'expect';
import ezMasterConfig, { validateConfig } from './ezMasterConfig';

describe('ezMasterConfig', () => {
    describe('validateConfig', () => {
        it('should throw if username is not present', () => {
            expect(() => validateConfig({})).toThrow();
        });

        it('should throw if password is not present', () => {
            expect(() => validateConfig({
                username: 'toto',
            })).toThrow();
        });

        it('should throw if naan is not valid', () => {
            expect(() => validateConfig({
                username: 'toto',
                password: 'titi',
                naan: 'abracadabra',
            })).toThrow();
        });

        it('should throw if subpublisher is not valid', () => {
            expect(() => validateConfig({
                username: 'toto',
                password: 'titi',
                naan: '555555',
                subpublisher: 'abracadabra',
            })).toThrow();
        });

        it('should not throw if config is valid', () => {
            expect(() => validateConfig({
                username: 'toto',
                password: 'titi',
                naan: '555555',
                subpublisher: 'ABC',
            })).toThrow();
        });
    });

    it('should put ezMasterConfig on the context', async () => {
        const ctx = {};

        await ezMasterConfig(ctx, () => {});

        expect(ctx.ezMasterConfig).toBeTruthy();
    });
});
