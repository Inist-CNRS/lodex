import { transformer } from './transformer.js';
import documentationByOperation from './documentationByOperation.js';

export const valueToURLEncode = (value) =>
    typeof value === 'string' ? encodeURIComponent(value) : null;

const transformation = () => (value) => transformer(valueToURLEncode, value);

transformation.getMetas = () => ({
    name: 'URLENCODE',
    type: 'transform',
    args: [],
    docUrl: documentationByOperation['URLENCODE'],
});

export default transformation;
