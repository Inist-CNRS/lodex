import smartMap from './smartMap';

export const valueToNumber = value => {
    const number = Number(value);

    return isNaN(number) ? 0 : number;
};

const toNumber = smartMap(valueToNumber);

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(toNumber(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'NUMBER',
    type: 'transform',
    args: [],
});

export default transformation;
