import { csv } from 'json-csv';
import through from 'through';

export function getLastVersion({ uri, versions }) {
    this.queue({
        ...versions[versions.length - 1],
        uri,
    });
}

export const getCsvFieldFactory = getCharacteristicByName => ({ cover, label, name }) => ({
    filter: value => (cover === 'dataset' ? getCharacteristicByName(name).value : value),
    label: label || name,
    name,
    quoted: true,
});

export const exportCsvFactory = csvTransformStreamFactory => (fields, characteristics, stream) => {
    const getCharacteristicByName = name => characteristics.find(({ name: cName }) => cName === name);
    const getCsvField = getCsvFieldFactory(getCharacteristicByName);

    const jsoncsvStream = csvTransformStreamFactory({
        fields: fields.map(getCsvField),
        fieldSeparator: ';',
    });

    return stream
        .pipe(through(getLastVersion))
        .pipe(jsoncsvStream);
};

export default exportCsvFactory(csv);
