import { transformer } from './transformer';

export const valueToUpperCase = value =>
    typeof value === 'string' ? value.toUpperCase() : value;

const transformation = () => value => transformer(valueToUpperCase, value);

transformation.getMetas = () => ({
    name: 'UPPERCASE',
    type: 'transform',
    args: [],
});

export default transformation;
