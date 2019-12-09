const fs = require('fs');
const { resolve } = require('path');
const CSV = require('csv-string');

let lastCacheTimestamp = null;
let translations = {};

const getFileUpdatedDate = path => {
    const stats = fs.statSync(path);
    return stats.mtime;
};

const shouldUpdateCache = (filePutInCacheDate, fileLastUpdatedDate) =>
    fileLastUpdatedDate > filePutInCacheDate;

const getLanguageTranslations = (language, index) => {
    const path = resolve(__dirname, './custom/translations.tsv');
    if (!fs.existsSync(path)) {
        console.error('The translation file is missing.');
        return {};
    }

    const lastUpdateTimestamp = getFileUpdatedDate(path);

    if (shouldUpdateCache(lastCacheTimestamp, lastUpdateTimestamp)) {
        const tsv = fs.readFileSync(path, 'utf8');
        const csv = CSV.parse(tsv, `\t`, '"');
        translations[language] = csv.reduce(
            (acc, line) => ({
                ...acc,
                [line[0]]: line[index],
            }),
            {},
        );
        lastCacheTimestamp = new Date().getTime();
    }
    return translations[language];
};

const getTranslations = locale => {
    if (typeof locale != 'string') {
        locale = 'en';
    }
    const language = locale.toLowerCase();
    if (language.startsWith('fr')) {
        return getLanguageTranslations('french', 2);
    }
    return getLanguageTranslations('english', 1);
};

module.exports = {
    translate: locale => getTranslations(locale),
};
