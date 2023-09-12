import { transformer } from './transformer';

export const valueToNumber = value => {

    const number = typeof value === 'number' ? value : Number(String(value).replace(/,/, '.'));

    return Number.isNaN(number) ? 0 : number;
};

const transformation = () => value => transformer(valueToNumber, value);

transformation.getMetas = () => ({
    name: 'NUMBER',
    type: 'transform',
    args: [],
});

export default transformation;
