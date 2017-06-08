import { csv } from 'json-csv';
import through from 'through';
import { getDefaultDocuments, getCsvFieldFactory, getLastVersionFactory } from './ezsLocals/convertToCSV';

export const exportCsvFactory = csvTransformStreamFactory => (config, fields, characteristics, stream) => {
    const defaultDocument = getDefaultDocuments(fields);
    const getCharacteristicByName = name => characteristics[0][name];
    const getCsvField = getCsvFieldFactory(getCharacteristicByName);

    const jsoncsvStream = csvTransformStreamFactory({
        fields: fields.map(getCsvField),
        fieldSeparator: ';',
    });

    return stream
        .pipe(through(getLastVersionFactory(defaultDocument)))
        .pipe(jsoncsvStream);
};

const exporter = exportCsvFactory(csv);
exporter.extension = 'csv';
exporter.mimeType = 'text/csv';
exporter.type = 'file';
exporter.label = 'csv';

export default exporter;
