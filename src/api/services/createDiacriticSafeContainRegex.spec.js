import { createDiacriticSafeContainRegex } from './createDiacriticSafeContainRegex';

describe('createDiacriticSafeContainRegex', () => {
    it('should replace a with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hat')).toEqual(
            /^.*h[aàáâãäåă]t.*$/gi,
        );
        expect(createDiacriticSafeContainRegex('à')).toEqual(
            /^.*[aàáâãäåă].*$/gi,
        );
    });

    it('should replace c with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hct')).toEqual(
            /^.*h[cç]t.*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ç')).toEqual(/^.*[cç].*$/gi);
    });

    it('should replace e with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('het')).toEqual(
            /^.*h[eèéêë]t.*$/gi,
        );
        expect(createDiacriticSafeContainRegex('é')).toEqual(/^.*[eèéêë].*$/gi);
    });

    it('should replace i with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hit')).toEqual(
            /^.*h[iìíîï]t.*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ì')).toEqual(/^.*[iìíîï].*$/gi);
    });

    it('should replace n with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hnt')).toEqual(
            /^.*h[nñ]t.*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ñ')).toEqual(/^.*[nñ].*$/gi);
    });

    it('should replace o with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hot')).toEqual(
            /^.*h[oòóôõö]t.*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ò')).toEqual(
            /^.*[oòóôõö].*$/gi,
        );
    });

    it('should replace u with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hut')).toEqual(
            /^.*h[uùúûü]t.*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ù')).toEqual(/^.*[uùúûü].*$/gi);
    });

    it('should replace y with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hyt')).toEqual(
            /^.*h[yýÿ]t.*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ÿ')).toEqual(/^.*[yýÿ].*$/gi);
    });
});
