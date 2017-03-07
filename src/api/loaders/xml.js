import ezs from 'ezs';
import ezsBasics from 'ezs-basics';

ezs.use(ezsBasics);

export default config => stream =>
    stream
        .pipe(ezs('XMLParse', { separator: [
          '/RDF/*', 
          '/rdf:RDF/*',
          '/modsCollection/mods',
          '/teiCorpus/TEI',
          '/root/*',
          '/struct/*',
          '/rss/channel/item',
          '/feed/entry',
          '/rows/row',
        ], ...config }))
        .pipe(ezs('flatten', { separator: '/' }))
        .pipe(ezs('standardize'));
