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
        .pipe(
            // FIXME: add ezs.use(ezsIstex)
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
        .pipe(ezs.catch());

exporter.extension = 'nq';
exporter.mimeType = 'application/n-quads';
exporter.type = 'file';
exporter.label = 'extendednquads';

export default exporter;
