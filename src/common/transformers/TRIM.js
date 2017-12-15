import smartMap from './smartMap';

export const trimString = value =>
    typeof value === 'string' ? value.trim() : value;

export const trim = smartMap(trimString);

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(trim(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'TRIM',
    type: 'transform',
    args: [],
});

export default transformation;
