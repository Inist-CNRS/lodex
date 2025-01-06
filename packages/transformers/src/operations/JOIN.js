import { rawTransformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation.json';

export const join = (value, separator) => {
    if (!value) {
        return '';
    }

    if (!Array.isArray(value)) {
        throw new Error('Invalid value: need an array');
    }

    return value.join(separator);
};

const transformation = (_, args) => (value) =>
    rawTransformerWithArg(join, 'separator', value, args);

transformation.getMetas = () => ({
    name: 'JOIN',
    type: 'transform',
    args: [{ name: 'separator', type: 'string' }],
    docUrl: documentationByOperation['JOIN'],
});

export default transformation;
