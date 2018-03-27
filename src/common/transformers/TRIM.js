import { transformer } from './transformer';

export const trimString = value =>
    typeof value === 'string' ? value.trim() : value;

const transformation = () => value => transformer(trimString, value);

transformation.getMetas = () => ({
    name: 'TRIM',
    type: 'transform',
    args: [],
});

export default transformation;
