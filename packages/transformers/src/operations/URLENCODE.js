import { transformer } from './transformer';
import documentationByOperation from './documentationByOperation.json';

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
