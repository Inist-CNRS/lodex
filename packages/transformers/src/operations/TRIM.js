import { transformer } from './transformer';
import documentationByOperation from './documentationByOperation.json';

export const trimString = (value) =>
    typeof value === 'string' ? value.trim() : value;

const transformation = () => (value) => transformer(trimString, value);

transformation.getMetas = () => ({
    name: 'TRIM',
    type: 'transform',
    args: [],
    docUrl: documentationByOperation['TRIM'],
});

export default transformation;
