import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsISTEX from 'ezs-istex';

ezs.use(ezsBasics);
ezs.use(ezsISTEX);

const output =
    'corpusName,author,language,abstract,title,pmid,' +
    'genre,host,publicationDate,copyrightDate,id,' +
    'score,serie,fulltext';

export default config => stream =>
    stream
        .pipe(ezs('stringify'))
        .pipe(ezs('concat'))
        .pipe(ezs('ISTEXCorpus'))
        .pipe(ezs('ISTEXQuery', { params: { output, ...config } }))
        .pipe(ezs('ISTEXHarvest'))
        .pipe(ezs('ISTEXRequest'))
        .pipe(ezs('ISTEXHits'))
        .pipe(ezs('flatten'));
