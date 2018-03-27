import { rawTransformerWithArg } from './transformer';

export const split = (value, separator) => {
    if (!value) {
        return [];
    }

    if (typeof value !== 'string') {
        throw new Error('Invalid value: need a string');
    }

    return value.split(separator).map(x => x.trim());
};

const transformation = (_, args) => value =>
    rawTransformerWithArg(split, 'separator', value, args);

transformation.getMetas = () => ({
    name: 'SPLIT',
    type: 'transform',
    args: [{ name: 'separator', type: 'string' }],
});

export default transformation;
