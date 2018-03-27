import { rawTransformerWithArg } from './transformer';

export const shift = (value, arg) => {
    if (!value) {
        return value;
    }
    const gap = Number(arg);
    return Array.isArray(value) || typeof value === 'string'
        ? value.slice(gap)
        : gap - value;
};

const transformation = (_, args) => value =>
    rawTransformerWithArg(shift, 'gap', value, args);

transformation.getMetas = () => ({
    name: 'SHIFT',
    type: 'transform',
    args: [{ name: 'gap', type: 'number' }],
});

export default transformation;
