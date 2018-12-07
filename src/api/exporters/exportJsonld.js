import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLodex from 'ezs-lodex';

ezs.use(ezsBasics);
ezs.use(ezsLodex);

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(
            ezs('JSONLDObject', {
                fields,
                characteristics,
                collectionClass: config.collectionClass,
                exportDataset: config.exportDataset,
            }),
        )
        .pipe(
            ezs('linkDataset', {
                uri: config.cleanHost,
                scheme: config.schemeForDatasetLink,
                datasetClass: config.datasetClass,
            }),
        )
        .pipe(ezs('jsonify'));

exporter.extension = 'json';
exporter.mimeType = 'application/json';
exporter.type = 'file';
exporter.label = 'jsonld';

export default exporter;
