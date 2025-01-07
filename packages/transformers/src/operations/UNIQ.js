import uniq from 'lodash/uniq';
import documentationByOperation from './documentationByOperation';

export const uniqArray = (value) => {
    if (value === null || typeof value === 'undefined') {
        return null;
    }

    if (Array.isArray(value)) {
        return uniq(value);
    }

    if (typeof value === 'object') {
        return null;
    }

    return value;
};

const transformation = () => (value) =>
    new Promise((resolve, reject) => {
        try {
            resolve(uniqArray(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'UNIQ',
    type: 'transform',
    args: [],
    docUrl: documentationByOperation['UNIQ'],
});

export default transformation;
