// @ts-expect-error TS7006
export default (field, resource, fields, type, value) => {
    switch (type) {
        case 'text':
            return value;

        case 'column': {
            return resource[value];
        }

        case 'value':
        default:
            return resource[field.name];
    }
};
