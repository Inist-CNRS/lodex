export default function convertToJson(this: any, input: any, output: any) {
    const fields = this.getParam('fields', {});

    if (this.isLast()) {
        return output.close();
    }

    const getLabel = fields.reduce(
        (data: any, field: any) => {
            data[field.name] = field.label;

            return data;
        },
        { uri: 'uri' },
    );

    const getLang = fields.reduce(
        (data: any, field: any) => {
            data[field.name] = field.language;

            return data;
        },
        { uri: 'uri' },
    );

    const changedFields = Object.entries(input)
        .filter(([name]) => name !== 'uri')
        .map(([name, value]) => ({
            name,
            value,
            label: getLabel[name],
            language: getLang[name],
        }));

    const changedResource = {
        uri: input.uri,
        fields: changedFields,
    };

    return output.send(changedResource);
}
