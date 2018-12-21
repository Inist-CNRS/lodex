import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLodex from 'ezs-lodex';

ezs.use(ezsBasics);
ezs.use(ezsLodex);

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('convertToSitemap'))
        .pipe(ezs.catch(console.error))
        .pipe(ezs.toBuffer());

exporter.extension = 'xml';
exporter.mimeType = 'application/xml';
exporter.type = 'file';
exporter.label = 'sitemap';

export default exporter;
