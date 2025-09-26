import fs from 'fs';
import { resolve } from 'path';
import CSV from 'csv-string';
import moment from 'moment';

const getFileUpdatedDate = (path: any) => {
    const stats = fs.statSync(path);
    return stats.mtime;
};

const shouldUpdateTranslations = (
    fileCacheTime: any,
    fileLastUpdatedTime: any,
) =>
    lastCacheTimestamp === null ||
    moment(fileLastUpdatedTime).isAfter(fileCacheTime);

const parseTranslationsFile = (path: any) => {
    const tsv = fs.readFileSync(path, 'utf8');
    const csv = CSV.parse(tsv, `\t`, '"');

    const translations = {};
    ['english', 'french'].forEach((language: any, index: any) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        translations[language] = csv.reduce(
            (acc, line) => ({
                ...acc,
                // @ts-expect-error TS(7006): Parameter 'acc' implicitly has an 'any' type.
                [line[0]]: line[index + 1],
            }),
            {},
        );
    });
    return translations;
};

let lastCacheTimestamp: any = null;
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
        ? // @ts-expect-error TS(2339): Property 'french' does not exist on type '{}'.
          translations.french
        : // @ts-expect-error TS(2339): Property 'english' does not exist on type '{}'.
          translations.english;
};

module.exports = {
    getByLanguage,
};
