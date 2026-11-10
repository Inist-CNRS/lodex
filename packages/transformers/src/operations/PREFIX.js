import { transformerWithArg } from './transformer.js';
import documentationByOperation from './documentationByOperation.js';

export const prefix = (value, str) =>
    typeof value === 'string' ? str.concat(value) : value;

const transformation = (_, args) => (value) =>
    transformerWithArg(prefix, 'with', value, args);

transformation.getMetas = () => ({
    name: 'PREFIX',
    type: 'transform',
    args: [{ name: 'with', type: 'string' }],
    docUrl: documentationByOperation['PREFIX'],
});

export default transformation;
