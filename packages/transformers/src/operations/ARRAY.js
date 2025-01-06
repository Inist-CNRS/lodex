import { rawTransformerWithoutArg } from './transformer';
import documentationByOperation from './documentationByOperation';

export const valueToArray = (value) => {
    const arr = Array.isArray(value) ? value : [value];
    return arr.filter((x) => x);
};

const transformation = () => (value) =>
    rawTransformerWithoutArg(valueToArray, value);

transformation.getMetas = () => ({
    name: 'ARRAY',
    type: 'transform',
    args: [],
    docUrl: documentationByOperation['ARRAY'],
});

export default transformation;
