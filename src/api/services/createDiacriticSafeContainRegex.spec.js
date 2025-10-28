import { createDiacriticSafeContainRegex } from './createDiacriticSafeContainRegex';

describe('createDiacriticSafeContainRegex', () => {
    it('should replace a with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hat')).toEqual(
            /^.*[hĥħȟ][aàáâãäåāăąǎǟǡǻȁȃȧȺ][tţťŧƫƭƮțȶȾ].*$/i,
        );
        expect(createDiacriticSafeContainRegex('à')).toEqual(
            /^.*[aàáâãäåāăąǎǟǡǻȁȃȧȺ].*$/i,
        );
    });

    it('should replace c with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hct')).toEqual(
            /^.*[hĥħȟ][cçćĉċčƈȼ][tţťŧƫƭƮțȶȾ].*$/i,
        );
        expect(createDiacriticSafeContainRegex('ç')).toEqual(
            /^.*[cçćĉċčƈȼ].*$/i,
        );
    });

    it('should replace e with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('het')).toEqual(
            /^.*[hĥħȟ][eèéêëėęěēƎƏƐǝȅȇȩɇɛƩƪ][tţťŧƫƭƮțȶȾ].*$/i,
        );
        expect(createDiacriticSafeContainRegex('é')).toEqual(
            /^.*[eèéêëėęěēƎƏƐǝȅȇȩɇɛƩƪ].*$/i,
        );
    });

    it('should replace i with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hit')).toEqual(
            /^.*[hĥħȟ][iìíîïĩĭįıƖƗǐȉȋ][tţťŧƫƭƮțȶȾ].*$/i,
        );
        expect(createDiacriticSafeContainRegex('ì')).toEqual(
            /^.*[iìíîïĩĭįıƖƗǐȉȋ].*$/i,
        );
    });

    it('should replace n with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hnt')).toEqual(
            /^.*[hĥħȟ][nñńņňŉŋƞƝǹȵ][tţťŧƫƭƮțȶȾ].*$/i,
        );
        expect(createDiacriticSafeContainRegex('ñ')).toEqual(
            /^.*[nñńņňŉŋƞƝǹȵ].*$/i,
        );
    });

    it('should replace o with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hot')).toEqual(
            /^.*[hĥħȟ][oòóôõöøǿōŏőǒȱƆƟơǫǭȍȏȫȭȯȱ][tţťŧƫƭƮțȶȾ].*$/i,
        );
        expect(createDiacriticSafeContainRegex('ò')).toEqual(
            /^.*[oòóôõöøǿōŏőǒȱƆƟơǫǭȍȏȫȭȯȱ].*$/i,
        );
    });

    it('should replace u with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hut')).toEqual(
            /^.*[hĥħȟ][uùúûüũūŭůűųǔǖǘǚǜưƱȕȗɄυƱ][tţťŧƫƭƮțȶȾ].*$/i,
        );
        expect(createDiacriticSafeContainRegex('ù')).toEqual(
            /^.*[uùúûüũūŭůűųǔǖǘǚǜưƱȕȗɄυƱ].*$/i,
        );
    });

    it('should replace y with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hyp')).toEqual(
            /^.*[hĥħȟ][yýÿŷȳƴɏȝ][pƿƥ].*$/i,
        );
        expect(createDiacriticSafeContainRegex('ÿ')).toEqual(
            /^.*[yýÿŷȳƴɏȝ].*$/i,
        );
    });

    it('should support multi characters regexes', () => {
        expect(createDiacriticSafeContainRegex('haet')).toEqual(
            /^.*[hĥħȟ](([aàáâãäåāăąǎǟǡǻȁȃȧȺ][eèéêëėęěēƎƏƐǝȅȇȩɇɛƩƪ])|æ|ǽ|ǣ)[tţťŧƫƭƮțȶȾ].*$/i,
        );
        expect(createDiacriticSafeContainRegex('æ')).toEqual(
            /^.*(([aàáâãäåāăąǎǟǡǻȁȃȧȺ][eèéêëėęěēƎƏƐǝȅȇȩɇɛƩƪ])|æ|ǽ|ǣ).*$/i,
        );
    });

    it('should replace composed characters', () => {
        expect(createDiacriticSafeContainRegex('ß')).toEqual(
            /^.*(([sśŝşšſƨșȿ][sśŝşšſƨșȿ])|ß).*$/i,
        );
    });

    it('should handle special characters', () => {
        expect(createDiacriticSafeContainRegex('-')).toEqual(
            /^.*[-‐‑‒–—―].*$/i,
        );
        expect(createDiacriticSafeContainRegex('/')).toEqual(/^.*[/⁄∕].*$/i);
    });

    it('should handle single characters', () => {
        expect(createDiacriticSafeContainRegex('C')).toEqual(
            /^.*[cçćĉċčƈȼ].*$/i,
        );
        expect(createDiacriticSafeContainRegex('O')).toEqual(
            /^.*[oòóôõöøǿōŏőǒȱƆƟơǫǭȍȏȫȭȯȱ].*$/i,
        );
    });

    it('should handle empty or whitespace-only values', () => {
        expect(createDiacriticSafeContainRegex('')).toEqual(/(?!.*)/i);
        expect(createDiacriticSafeContainRegex('   ')).toEqual(/(?!.*)/i);
    });
});
