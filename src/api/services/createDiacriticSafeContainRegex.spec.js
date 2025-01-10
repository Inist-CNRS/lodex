import { createDiacriticSafeContainRegex } from './createDiacriticSafeContainRegex';

describe('createDiacriticSafeContainRegex', () => {
    it('should replace a with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hat')).toEqual(
            /^.*[hĥħȟ][aàáâãäåāăąǎǟǡǻȁȃȧȺ][tţťŧƫƭƮțȶȾ].*$/gi,
        );
        expect(createDiacriticSafeContainRegex('à')).toEqual(
            /^.*[aàáâãäåāăąǎǟǡǻȁȃȧȺ].*$/gi,
        );
    });

    it('should replace c with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hct')).toEqual(
            /^.*[hĥħȟ][cçćĉċčƈȼ][tţťŧƫƭƮțȶȾ].*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ç')).toEqual(
            /^.*[cçćĉċčƈȼ].*$/gi,
        );
    });

    it('should replace e with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('het')).toEqual(
            /^.*[hĥħȟ][eèéêëėęěēƎƏƐǝȅȇȩɇɛƩƪ][tţťŧƫƭƮțȶȾ].*$/gi,
        );
        expect(createDiacriticSafeContainRegex('é')).toEqual(
            /^.*[eèéêëėęěēƎƏƐǝȅȇȩɇɛƩƪ].*$/gi,
        );
    });

    it('should replace i with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hit')).toEqual(
            /^.*[hĥħȟ][iìíîïĩĭįıƖƗǐȉȋ][tţťŧƫƭƮțȶȾ].*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ì')).toEqual(
            /^.*[iìíîïĩĭįıƖƗǐȉȋ].*$/gi,
        );
    });

    it('should replace n with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hnt')).toEqual(
            /^.*[hĥħȟ][nñńņňŉŋƞƝǹȵ][tţťŧƫƭƮțȶȾ].*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ñ')).toEqual(
            /^.*[nñńņňŉŋƞƝǹȵ].*$/gi,
        );
    });

    it('should replace o with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hot')).toEqual(
            /^.*[hĥħȟ][oòóôõöøǿōŏőǒȱƆƟơǫǭȍȏȫȭȯȱ][tţťŧƫƭƮțȶȾ].*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ò')).toEqual(
            /^.*[oòóôõöøǿōŏőǒȱƆƟơǫǭȍȏȫȭȯȱ].*$/gi,
        );
    });

    it('should replace u with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hut')).toEqual(
            /^.*[hĥħȟ][uùúûüũūŭůűųǔǖǘǚǜưƱȕȗɄυƱ][tţťŧƫƭƮțȶȾ].*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ù')).toEqual(
            /^.*[uùúûüũūŭůűųǔǖǘǚǜưƱȕȗɄυƱ].*$/gi,
        );
    });

    it('should replace y with diactrics proof regex', () => {
        expect(createDiacriticSafeContainRegex('hyp')).toEqual(
            /^.*[hĥħȟ][yýÿŷȳƴɏȝ][pƿƥ].*$/gi,
        );
        expect(createDiacriticSafeContainRegex('ÿ')).toEqual(
            /^.*[yýÿŷȳƴɏȝ].*$/gi,
        );
    });

    it('should support multi characters regexes', () => {
        expect(createDiacriticSafeContainRegex('haet')).toEqual(
            /^.*[hĥħȟ](([aàáâãäåāăąǎǟǡǻȁȃȧȺ][eèéêëėęěēƎƏƐǝȅȇȩɇɛƩƪ])|æ|ǽ|ǣ)[tţťŧƫƭƮțȶȾ].*$/gi,
        );
        expect(createDiacriticSafeContainRegex('æ')).toEqual(
            /^.*(([aàáâãäåāăąǎǟǡǻȁȃȧȺ][eèéêëėęěēƎƏƐǝȅȇȩɇɛƩƪ])|æ|ǽ|ǣ).*$/gi,
        );
    });

    it('should replace composed characters', () => {
        expect(createDiacriticSafeContainRegex('ß')).toEqual(
            /^.*(([sśŝşšſƨșȿ][sśŝşšſƨșȿ])|ß).*$/gi,
        );
    });
});
