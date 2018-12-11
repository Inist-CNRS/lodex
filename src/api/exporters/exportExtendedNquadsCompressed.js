import from from 'from';
import ezs from 'ezs';
import ezsLodex from 'ezs-lodex';
import ezsIstex from 'ezs-istex';
import ezsBasics from 'ezs-basics';

ezs.use(ezsLodex);
ezs.use(ezsIstex);
ezs.use(ezsBasics);

/**
 * export data into the feed
 *
 * @param {object} data One LODEX document
 * @param {stream} feed N-Quads
 * @returns
 */
function ezsExport(data, feed) {
    const config = this.getParam('config');
    const fields = this.getParam('fields');

    if (this.isLast()) {
        return feed.close();
    }
    from([data])
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('extractIstexQuery', { fields, config }))
        .pipe(ezs('extract', { path: 'content' }))
        .pipe(
            ezs('ISTEXScroll', {
                field: Object.keys(config.istexQuery.context).filter(
                    e => e !== config.istexQuery.linked,
                ),
            }),
        )
        .pipe(ezs('ISTEXResult'))
        .on('data', d => {
            const o = {
                lodex: {
                    uri: data.uri,
                },
                content: d,
            };
            const subInput = ezs.createStream(ezs.objectMode());
            subInput
                .pipe(ezs('convertToExtendedJsonLd', { config }))
                .pipe(ezs('convertJsonLdToNQuads'))
                .on('data', d => {
                    feed.write(d);
                })
                .on('end', () => feed.end())
                .on('error', err => {
                    console.error(err);
                    feed.stop(err);
                });

            subInput.write(o);
            subInput.end();
            subInput.destroy();
        })
        .on('close', () => feed.end())
        .on('error', err => {
            console.error(err);
        });
}

const exporter = (config, fields, characteristics, stream) => {
    return stream.pipe(ezs(ezsExport, { config, fields })).pipe(ezs.compress());
};

exporter.extension = 'nq.gz';
exporter.mimeType = 'application/gzip';
exporter.type = 'file';
exporter.label = 'extendednquadscompressed';

export default exporter;
