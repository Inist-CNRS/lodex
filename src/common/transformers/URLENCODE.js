import { transformer } from './transformer';

export const valueToURLEncode = value =>
    typeof value === 'string' ? encodeURIComponent(value) : null;

const transformation = () => value => transformer(valueToURLEncode, value);

transformation.getMetas = () => ({
    name: 'URLENCODE',
    type: 'transform',
    args: [],
});

export default transformation;
