const fs = require('fs');
const { resolve } = require('path');
const CSV = require('csv-string');

let languages = ['english', 'french'];

let lastModifiedTime;
let traductions = {};

const getFileUpdatedDate = path => {
    const stats = fs.statSync(path);
    return stats.mtime;
};

const getTranslations = language => {
    const path = resolve(__dirname, './custom/translations.tsv');
    const lastTime = getFileUpdatedDate(path);
    if (lastModifiedTime != lastTime) {
        const tsv = fs.readFileSync(path, 'utf8');
        const csv = CSV.parse(tsv, `\t`, '"');
        traductions[language] = csv.reduce(
            (acc, line) => ({
                ...acc,
                [line[0]]: line[languages.indexOf(language) + 1],
            }),
            {},
        );
    }
    return traductions[language];
};

module.exports = {
    english: () => getTranslations('english'),
    french: () => getTranslations('french'),
};
