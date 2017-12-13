import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import zlib from 'zlib';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('extractIstexQuery', { fields, config }))
        .pipe(
            ezs('ISTEXSearch', {
                source: 'content',
                target: 'content',
                field: Object.keys(config.istexQuery.context).filter(
                    e => e !== config.istexQuery.linked,
                ),
            }),
        )
        .pipe(
            ezs('ISTEXScroll', {
                source: 'content',
                target: 'content',
            }),
        )
        .pipe(
            ezs('ISTEXResult', {
                source: 'content',
                target: 'content',
            }),
        )
        .pipe(ezs('convertToExtendedJsonLd', { config }))
        .pipe(ezs('convertJsonLdToNQuads'))
        .pipe(ezs.catch())
        .pipe(zlib.createGzip());

exporter.extension = 'nq.gz';
exporter.mimeType = 'application/gzip';
exporter.type = 'file';
exporter.label = 'extendednquadscompressed';

export default exporter;
