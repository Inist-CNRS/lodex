export default (field, linkedResource, resource, fields, type, value) => {
    switch (type) {
        case 'text':
            return value;

        case 'column': {
            if (linkedResource) {
                const fieldForLabel = fields.find(f => f.label === value);
                return linkedResource[fieldForLabel.name];
            }
            return resource[field.name];
        }

        case 'value':
        default:
            return resource[field.name];
    }
};
