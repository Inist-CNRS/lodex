import { transformer } from './transformer';

export const valueToNumber = value => {
    const number = Number(value);

    return isNaN(number) ? 0 : number;
};

const transformation = () => value => transformer(valueToNumber, value);

transformation.getMetas = () => ({
    name: 'NUMBER',
    type: 'transform',
    args: [],
});

export default transformation;
