import csvAlternative from './parseCsv';
import csv from './csv';
import csvSemicolon from './csv-semicolon';
import csvComma from './csv-comma';
import tsv from './tsv';
import skos from './skos';
import json from './json';
import jsonIstex from './json-istex';
import jsonLodex from './json-lodex';
import xml from './xml';
import corpus from './corpus';
import tsvDoubleQuotes from './tsv-double-quotes';

const loaders = {
    csv,
    'csv-semicolon': csvSemicolon,
    'csv-comma': csvComma,
    'csv-alternative': csvAlternative,
    tsv,
    'tsv-double-quotes': tsvDoubleQuotes,
    rdf: xml,
    skos,
    json,
    'json-istex': jsonIstex,
    'json-lodex': jsonLodex,
    rss: xml,
    atom: xml,
    mods: xml,
    tei: xml,
    corpus,
};

export default loaders;

export const loaderKeys = Object.keys(loaders);
