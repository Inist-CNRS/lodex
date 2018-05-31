import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) => {
    const changeData = fields.reduce(
        (data, field) => {
            data[field.name] = field.label;

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
                        label: changeData[name],
                    }));
                const changedResource = {
                    uri: resource.uri,
                    fields: changedFields,
                };
                output.send(changedResource);
            }),
        )
        .pipe(ezs('debug'))
        .pipe(ezs('jsonify'));
};

exporter.extension = 'json';
exporter.mimeType = 'application/json';
exporter.type = 'file';
exporter.label = 'json';

export default exporter;
