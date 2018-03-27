import { transformer } from './transformer';

export const valueToLowerCase = value =>
    typeof value === 'string' ? value.toLowerCase() : value;

const transformation = () => value => transformer(valueToLowerCase, value);

transformation.getMetas = () => ({
    name: 'LOWERCASE',
    type: 'transform',
    args: [],
});

export default transformation;
