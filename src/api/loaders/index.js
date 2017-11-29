import CSV from './parseCsv';
import csv from './csv';
import csvSemicolon from './csv-semicolon';
import csvComma from './csv-comma';
import tsv from './tsv';
import skos from './skos';
import json from './json';
import xml from './xml';
import corpus from './corpus';
import tsvDoubleQuotes from './tsv-double-quotes';

const loaders = {
    CSV,
    csv,
    'csv-semicolon': csvSemicolon,
    'csv-comma': csvComma,
    tsv,
    'tsv-double-quotes': tsvDoubleQuotes,
    rdf: xml,
    skos,
    json,
    rss: xml,
    atom: xml,
    mods: xml,
    tei: xml,
    corpus,
};

export default loaders;

export const loaderKeys = Object.keys(loaders);
