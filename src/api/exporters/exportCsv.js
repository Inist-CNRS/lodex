import { csv } from 'json-csv';

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

    return stream.pipe(jsoncsvStream);
};

export default exportCsvFactory(csv);
