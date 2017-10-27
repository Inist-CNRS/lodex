import csv from './exportCsv';
import tsv from './exportTsv';
import nquads from './exportNQuads';
import turtle from './exportTurtle';
import atom from './exportAtom';
import jsonld from './exportJsonld';
import jsonldcompacted from './exportJsonldCompacted';
import widget from './exportWidgetResource';
import extendednquads from './exportExtendedNquads';
import extendednquadscompressed from './exportExtendedNquadsCompressed';

export default {
    atom,
    csv,
    extendednquads,
    extendednquadscompressed,
    jsonld,
    jsonldcompacted,
    nquads,
    tsv,
    turtle,
    widget,
};
