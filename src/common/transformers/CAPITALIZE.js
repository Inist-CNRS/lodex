import { transformer } from './transformer';

export const capitalizeString = value =>
    typeof value === 'string'
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;

const transformation = () => value => transformer(capitalizeString, value);

transformation.getMetas = () => ({
    name: 'CAPITALIZE',
    type: 'transform',
    args: [],
});

export default transformation;
