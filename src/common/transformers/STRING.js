import { transformer } from './transformer';

export const valueToString = value => {
    if (value === null || typeof value === 'undefined') {
        return '';
    }

    if (typeof value === 'string') {
        return value.trim();
    }

    if (typeof value === 'object') {
        return '';
    }

    return String(value).trim();
};

const transformation = () => value => transformer(valueToString, value);

transformation.getMetas = () => ({
    name: 'STRING',
    type: 'transform',
    args: [],
});

export default transformation;
