import { transformer } from './transformer';
import documentationByOperation from './documentationByOperation.json';

export const valueToUpperCase = (value) =>
    typeof value === 'string' ? value.toUpperCase() : value;

const transformation = () => (value) => transformer(valueToUpperCase, value);

transformation.getMetas = () => ({
    name: 'UPPERCASE',
    type: 'transform',
    args: [],
    docUrl: documentationByOperation['UPPERCASE'],
});

export default transformation;
