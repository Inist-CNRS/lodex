import smartMap from './smartMap';

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

const toString = smartMap(valueToString);

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(toString(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'STRING',
    type: 'transform',
    args: [],
});

export default transformation;
