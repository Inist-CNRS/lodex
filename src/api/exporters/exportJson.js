import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) => {
    const getLabel = fields.reduce(
        (data, field) => {
            data[field.name] = field.label;

            return data;
        },
        { uri: 'uri' },
    );

    const getLang = fields.reduce(
        (data, field) => {
            data[field.name] = field.language;

            return data;
        },
        { uri: 'uri' },
    );

    return stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(
            ezs((resource, output) => {
                if (!resource) {
                    return output.close();
                }

                const changedFields = Object.entries(resource)
                    .filter(([name]) => name !== 'uri')
                    .map(([name, value]) => ({
                        name,
                        value,
                        label: getLabel[name],
                        language: getLang[name],
                    }));
                const changedResource = {
                    uri: resource.uri,
                    fields: changedFields,
                };
                output.send(changedResource);
            }),
        )
        .pipe(ezs('jsonify'));
};

exporter.extension = 'json';
exporter.mimeType = 'application/json';
exporter.type = 'file';
exporter.label = 'json';

export default exporter;
