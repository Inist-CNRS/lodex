import { rawTransformerWithoutArg } from './transformer';

export const valueToArray = (value) => {
    const arr = Array.isArray(value) ? value : [value];
    return arr.filter((x) => x);
};

const transformation = () => (value) => rawTransformerWithoutArg(valueToArray, value);

transformation.getMetas = () => ({
    name: 'ARRAY',
    type: 'transform',
    args: [],
});

export default transformation;
