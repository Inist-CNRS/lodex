import { transformer } from './transformer';
import documentationByOperation from './documentationByOperation.json';

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
