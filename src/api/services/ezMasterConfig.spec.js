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

        it('should throw if NAAN is not valid', () => {
            expect(() => validateConfig({
                username: 'toto',
                password: 'titi',
                NAAN: 'abracadabra',
            })).toThrow();
        });

        it('should throw if subPublisherId is not valid', () => {
            expect(() => validateConfig({
                username: 'toto',
                password: 'titi',
                NAAN: '555555',
                subPublisherId: 'abracadabra',
            })).toThrow();
        });

        it('should not throw if config is valid', () => {
            expect(() => validateConfig({
                username: 'toto',
                password: 'titi',
                NAAN: '555555',
                subPublisherId: 'ABC',
            })).toThrow();
        });
    });

    it('should put ezMasterConfig on the context', () => {
        const ctx = {};

        ezMasterConfig(ctx, () => {});

        expect(ctx.ezMasterConfig).toBeTruthy();
    });
});
