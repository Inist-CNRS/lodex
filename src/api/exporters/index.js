import csv from './exportCsv';
import raw from './exportRaw';
import tsv from './exportTsv';
import nquads from './exportNQuads';
import turtle from './exportTurtle';
import jsonld from './exportJsonld';
import widget from './exportWidgetResource';
import istex from './exportIstex';

export default {
    csv,
    istex,
    raw,
    tsv,
    jsonld,
    nquads,
    turtle,
    widget,
};
