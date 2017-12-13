import smartMap from './smartMap';

export const valueToUpperCase = value => {
    if (!value) {
        return null;
    }

    if (typeof value === 'object') {
        return null;
    }

    return String(value).toUpperCase();
};

const upperCase = smartMap(valueToUpperCase);

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(upperCase(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'UPPERCASE',
    type: 'transform',
    args: [],
});

export default transformation;
