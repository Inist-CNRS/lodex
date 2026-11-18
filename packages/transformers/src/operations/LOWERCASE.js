import { transformer } from './transformer.js';
import documentationByOperation from './documentationByOperation.js';

export const valueToLowerCase = (value) =>
    typeof value === 'string' ? value.toLowerCase() : value;

const transformation = () => (value) => transformer(valueToLowerCase, value);

transformation.getMetas = () => ({
    name: 'LOWERCASE',
    type: 'transform',
    args: [],
    docUrl: documentationByOperation['LOWERCASE'],
});

export default transformation;
