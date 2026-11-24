import { rawTransformerWithArg } from './transformer.js';

export const join = (value, separator) =>
    Array.isArray(value) ? value.join(separator) : value;

const transformation = (_, args) => (value) =>
    rawTransformerWithArg(join, 'separator', value, args);

transformation.getMetas = () => ({
    name: 'JOIN',
    type: 'transform',
    args: [{ name: 'separator', type: 'string' }],
    docUrl: documentationByOperation['JOIN'],
});

export default transformation;
