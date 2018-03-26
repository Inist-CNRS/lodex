import { rawTransformerWithArg } from './transformer';

export const truncate = (value, arg) => {
    if (!value) {
        return value;
    }
    const gap = Number(arg);
    return Array.isArray(value) || typeof value === 'string'
        ? value.slice(0, gap)
        : gap + value;
};

const transformation = (_, args) => value =>
    rawTransformerWithArg(truncate, 'gap', value, args);

transformation.getMetas = () => ({
    name: 'TRUNCATE',
    type: 'transform',
    args: [{ name: 'gap', type: 'number' }],
});

export default transformation;
