import csv from './exportCsv';
import tsv from './exportTsv';
import nquads from './exportNQuads';
import turtle from './exportTurtle';
import atom from './exportAtom';
import json from './exportJson';
import jsonld from './exportJsonld';
import jsonldcompacted from './exportJsonldCompacted';
import widget from './exportWidgetResource';
import extendednquads from './exportExtendedNquads';
import extendednquadscompressed from './exportExtendedNquadsCompressed';
import sitemap from './exportSitemap';

export default {
    atom,
    csv,
    extendednquads,
    extendednquadscompressed,
    json,
    jsonld,
    jsonldcompacted,
    nquads,
    sitemap,
    tsv,
    turtle,
    widget,
};
