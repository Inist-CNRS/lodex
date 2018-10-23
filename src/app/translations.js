const fs = require('fs');
const { resolve } = require('path');
const CSV = require('csv-string');

const translationsFile = resolve(__dirname, './translations.tsv');
const translationsTSV = fs.readFileSync(translationsFile, 'utf8');
const translationsRAW = CSV.parse(translationsTSV, `\t`, '"');

module.exports = {
    english: translationsRAW.reduce(
        (acc, line) => ({ ...acc, [line[0]]: line[1] }),
        {},
    ),
    french: translationsRAW.reduce(
        (acc, line) => ({ ...acc, [line[0]]: line[2] }),
        {},
    ),
};
