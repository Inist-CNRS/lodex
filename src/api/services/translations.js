const fs = require('fs');
const { resolve } = require('path');
const CSV = require('csv-string');
const moment = require('moment');

const getFileUpdatedDate = path => {
    const stats = fs.statSync(path);
    return stats.mtime;
};

const shouldUpdateTranslations = (fileCacheTime, fileLastUpdatedTime) =>
    lastCacheTimestamp === null ||
    moment(fileLastUpdatedTime).isAfter(fileCacheTime);

const parseTranslationsFile = path => {
    const tsv = fs.readFileSync(path, 'utf8');
    const csv = CSV.parse(tsv, `\t`, '"');

    const translations = {};
    ['english', 'french'].forEach((language, index) => {
        translations[language] = csv.reduce(
            (acc, line) => ({
                ...acc,
                [line[0]]: line[index + 1],
            }),
            {},
        );
    });
    return translations;
};

let lastCacheTimestamp = null;
let cachedTranslations = {};

const getTranslations = (filePath = '../../app/custom/translations.tsv') => {
    const path = resolve(__dirname, filePath);
    if (!fs.existsSync(path)) {
        console.error('The translation file is missing.');
        return {};
    }

    const lastUpdateTimestamp = getFileUpdatedDate(path);

    if (shouldUpdateTranslations(lastCacheTimestamp, lastUpdateTimestamp)) {
        cachedTranslations = parseTranslationsFile(path);
        lastCacheTimestamp = new Date();
    }
    return cachedTranslations;
};

const getByLanguage = (locale = 'en') => {
    const translations = getTranslations();

    if (typeof locale != 'string') {
        locale = 'en';
    }

    const language = locale.toLowerCase();
    return language.startsWith('fr')
        ? translations.french
        : translations.english;
};

module.exports = {
    getByLanguage,
};
