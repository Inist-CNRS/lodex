import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        // .pipe(ezs('debug'))
        .pipe(
            ezs('JSONLDObject', {
                fields,
                characteristics,
                collectionClass: config.collectionClass,
                exportDataset: config.exportDataset,
            }),
        )
        .pipe(ezs.catch(console.error))
        .pipe(
            ezs('linkDataset', {
                uri: config.cleanHost,
                scheme: config.schemeForDatasetLink,
                datasetClass: config.datasetClass,
            }),
        )
        .pipe(ezs('JSONLDString'));

exporter.extension = 'nq';
exporter.mimeType = 'application/n-quads';
exporter.type = 'file';
exporter.label = 'nquads';

export default exporter;
