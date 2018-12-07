import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLodex from 'ezs-lodex';

ezs.use(ezsBasics);
ezs.use(ezsLodex);

// TODO: write tests

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('extractIstexQuery', { fields, config }))
        .pipe(ezs('extract', { path: 'content' }))
        // FIXME: add ezs.use(ezsIstex)
        .pipe(
            ezs('ISTEXScroll', {
                field: Object.keys(config.istexQuery.context).filter(
                    e => e !== config.istexQuery.linked,
                ),
            }),
        )
        .pipe(ezs('ISTEXResult'))
        .pipe(ezs('convertToExtendedJsonLd', { config }))
        .pipe(ezs('convertJsonLdToNQuads'))
        .pipe(ezs.catch());

exporter.extension = 'nq';
exporter.mimeType = 'application/n-quads';
exporter.type = 'file';
exporter.label = 'extendednquads';

export default exporter;
