import smartMap from './smartMap';

export const capitalizeString = value =>
    typeof value === 'string'
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;

export const capitalize = smartMap(capitalizeString);

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(capitalize(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'CAPITALIZE',
    type: 'transform',
    args: [],
});

export default transformation;
