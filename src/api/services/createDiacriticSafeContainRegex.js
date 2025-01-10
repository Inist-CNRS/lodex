// Sources:
// - https://symbl.cc/fr/unicode/blocks/latin-1-supplement/
// - https://symbl.cc/fr/unicode/blocks/latin-extended-a/
// - https://symbl.cc/fr/unicode/blocks/latin-extended-b/
const singleCharsMappings = {
    a: '[aàáâãäåāăąǎǟǡǻȁȃȧȺ]',
    b: '[bƀƃƅƄɃ]',
    c: '[cçćĉċčƈȼ]',
    d: '[dďđƋƌƊƉȡδƍ]',
    e: '[eèéêëėęěēƎƏƐǝȅȇȩɇɛƩƪ]',
    f: '[fƒ]',
    g: '[gĝğġģǥǧǵƣ]',
    h: '[hĥħȟ]',
    i: '[iìíîïĩĭįıƖƗǐȉȋ]',
    j: '[jĵǰȷɉ]',
    k: '[kķĸƙǩ]',
    l: '[lĺļľŀłƚȴȽλƛ]',
    m: '[mƜ]',
    n: '[nñńņňŉŋƞƝǹȵ]',
    o: '[oòóôõöøǿōŏőǒȱƆƟơǫǭȍȏȫȭȯȱ]',
    p: '[pƿƥ]',
    q: '[qɋ]',
    r: '[rŕŗřȑȓɍ]',
    s: '[sśŝşšſƨșȿ]',
    t: '[tţťŧƫƭƮțȶȾ]',
    u: '[uùúûüũūŭůűųǔǖǘǚǜưƱȕȗɄυƱ]',
    v: '[vʋ]',
    w: '[wŵƿ]',
    x: '[xẋ]',
    y: '[yýÿŷȳƴɏȝ]',
    z: '[zźżžƶȥɀ]',
    ['5']: '[5ƽ]',
};

const multipleCharsMappings = {
    [`${singleCharsMappings.a}${singleCharsMappings.e}`]: `((${singleCharsMappings.a}${singleCharsMappings.e})|æ|ǽ|ǣ)`,
    [`${singleCharsMappings.d}${singleCharsMappings.b}`]: `((${singleCharsMappings.d}${singleCharsMappings.b})|ȸ)`,
    [`${singleCharsMappings.d}${singleCharsMappings.z}`]: `((${singleCharsMappings.d}${singleCharsMappings.z})|ǆ|ǳ)`,
    [`${singleCharsMappings.e}${singleCharsMappings.d}`]: `((${singleCharsMappings.e}${singleCharsMappings.d})|ð)`,
    [`${singleCharsMappings.e}${singleCharsMappings.j}`]: `((${singleCharsMappings.e}${singleCharsMappings.j})|Ʒ|ƹ|ƺ|ǯ)`,
    [`${singleCharsMappings.i}${singleCharsMappings.j}`]: `((${singleCharsMappings.i}${singleCharsMappings.j})|ĳ)`,
    [`${singleCharsMappings.l}${singleCharsMappings.j}`]: `((${singleCharsMappings.l}${singleCharsMappings.j})|ǉ)`,
    [`${singleCharsMappings.h}${singleCharsMappings.v}`]: `((${singleCharsMappings.h}${singleCharsMappings.v})|ƕ)`,
    [`${singleCharsMappings.n}${singleCharsMappings.j}`]: `((${singleCharsMappings.n}${singleCharsMappings.j})|ǌ)`,
    [`${singleCharsMappings.o}${singleCharsMappings.e}`]: `((${singleCharsMappings.o}${singleCharsMappings.e})|œ)`,
    [`${singleCharsMappings.o}${singleCharsMappings.u}`]: `((${singleCharsMappings.o}${singleCharsMappings.u})|ȣ)`,
    [`${singleCharsMappings.q}${singleCharsMappings.p}`]: `((${singleCharsMappings.q}${singleCharsMappings.p})|ȹ)`,
    [`${singleCharsMappings.s}${singleCharsMappings.s}`]: `((${singleCharsMappings.s}${singleCharsMappings.s})|ß)`,
    [`${singleCharsMappings.t}${singleCharsMappings.h}`]: `((${singleCharsMappings.t}${singleCharsMappings.h})|þ)`,
    [`${singleCharsMappings.t}${singleCharsMappings.s}`]: `((${singleCharsMappings.t}${singleCharsMappings.s})|ƾ|ʦ|ʧ)`,
    [`${singleCharsMappings.y}${singleCharsMappings.t}`]: `((${singleCharsMappings.y}${singleCharsMappings.t})|Ʀ)`,
};

const composedCharactersMappings = {
    ['æ']: 'ae',
    ['ȸ']: 'db',
    ['ǳ']: 'dz',
    ['ð']: 'ed',
    ['Ʒ']: 'ej',
    ['ĳ']: 'ij',
    ['ǉ']: 'lj',
    ['ƕ']: 'hv',
    ['ǌ']: 'nj',
    ['œ']: 'oe',
    ['ȣ']: 'ou',
    ['ȹ']: 'qp',
    ['ß']: 'ss',
    ['þ']: 'th',
    ['ƾ']: 'ts',
    ['ʦ']: 'ts',
    ['ʧ']: 'ts',
    ['Ʀ']: 'yr',
};

export function createDiacriticSafeContainRegex(value) {
    // We normalize the value to avoid issues with accents
    const normalizedValue = value
        .replace(/[.*+?^${}()|[\]\\]/gi, '\\$&')
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

    // We split composed characters into their single characters
    const normalizedValueWithComposedCharactersReplaced = Object.entries(
        composedCharactersMappings,
    ).reduce(
        (newValue, [letter, composed]) => newValue.replaceAll(letter, composed),
        normalizedValue,
    );

    const valueWithSingleCharactersDiacriticsReplaced = Object.entries(
        singleCharsMappings,
    ).reduce(
        (newValue, [letter, diacritics]) =>
            newValue.replaceAll(letter, diacritics),
        normalizedValueWithComposedCharactersReplaced,
    );

    const diacriticsSafeRegex = Object.entries(multipleCharsMappings).reduce(
        (newValue, [letters, diacritics]) =>
            newValue.replaceAll(
                new RegExp(
                    letters.replaceAll('[', '\\[').replaceAll(']', '\\]'),
                    'g',
                ),
                diacritics,
            ),
        valueWithSingleCharactersDiacriticsReplaced,
    );

    return new RegExp(`^.*${diacriticsSafeRegex}.*$`, 'gi');
}
