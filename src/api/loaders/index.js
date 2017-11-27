import CSV from './parseCsv'; // eslint-disable-line
import csv from './csv'; // eslint-disable-line
import csvSemicolon from './csv-semicolon'; // eslint-disable-line
import csvComma from './csv-comma'; // eslint-disable-line
import tsv from './tsv'; // eslint-disable-line
import skos from './skos'; // eslint-disable-line
import json from './json'; // eslint-disable-line
import xml from './xml'; // eslint-disable-line
import corpus from './corpus'; // eslint-disable-line

const loaders = {
    CSV,
    csv,
    'csv-semicolon': csvSemicolon,
    'csv-comma': csvComma,
    tsv,
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
