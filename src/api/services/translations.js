const fs = require('fs');
const { resolve } = require('path');
const CSV = require('csv-string');

let lastModifiedTime;
let traductions = {};

const getFileUpdatedDate = path => {
    const stats = fs.statSync(path);
    return stats.mtime;
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

const getLanguageTranslations = (language, index) => {
    const path = resolve(__dirname, './custom/translations.tsv');
    if (!fs.existsSync(path)) {
        console.log('The translation file is missing.');
        return {};
    }
    const lastTime = getFileUpdatedDate(path);
    if (lastModifiedTime != lastTime) {
        const tsv = fs.readFileSync(path, 'utf8');
        const csv = CSV.parse(tsv, `\t`, '"');
        traductions[language] = csv.reduce(
            (acc, line) => ({
                ...acc,
                [line[0]]: line[index],
            }),
            {},
        );
    }
    return traductions[language];
};

module.exports = {
    translate: locale => getTranslations(locale),
};
