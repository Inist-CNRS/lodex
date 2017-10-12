import csv from './exportCsv';
import raw from './exportRaw';
import tsv from './exportTsv';
import min from './exportMin';
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
    min,
    nquads,
    raw,
    tsv,
    turtle,
    widget,
};
