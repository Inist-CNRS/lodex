import { transformer } from './transformer.js';
import documentationByOperation from './documentationByOperation.js';

export const valueToNumber = (value) => {
    const number =
        typeof value === 'number'
            ? value
            : Number(String(value).replace(/,/, '.'));

    return Number.isNaN(number) ? 0 : number;
};

const transformation = () => (value) => transformer(valueToNumber, value);

transformation.getMetas = () => ({
    name: 'NUMBER',
    type: 'transform',
    args: [],
    docUrl: documentationByOperation['NUMBER'],
});

export default transformation;
