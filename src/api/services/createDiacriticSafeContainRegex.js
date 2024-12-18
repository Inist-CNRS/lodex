const regexMappings = {
    a: 'aàáâãäåă',
    c: 'cç',
    e: 'eèéêë',
    i: 'iìíîï',
    n: 'nñ',
    o: 'oòóôõö',
    u: 'uùúûü',
    y: 'yýÿ',
};

export function createDiacriticSafeContainRegex(value) {
    const normalizedValue = value
        .replace(/[.*+?^${}()|[\]\\]/gi, '\\$&')
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

    const diacriticSafeRegex = Object.entries(regexMappings).reduce(
        (newValue, [letter, diacritics]) =>
            newValue.replaceAll(letter, `[${diacritics}]`),
        normalizedValue,
    );

    return new RegExp(`^.*${diacriticSafeRegex}.*$`, 'gi');
}
