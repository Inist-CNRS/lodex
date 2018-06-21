import { rawTransformerWithArg } from './transformer';

export const split = (value, separator) => {
    if (!value) {
        return [];
    }

    if (typeof value !== 'string') {
        throw new Error('Invalid value: need a string');
    }
    let removeEmpty = value.split(separator).map(x => x.trim());
    return removeEmpty.filter(x => x != '');
};

const transformation = (_, args) => value =>
    rawTransformerWithArg(split, 'separator', value, args);

transformation.getMetas = () => ({
    name: 'SPLIT',
    type: 'transform',
    args: [{ name: 'separator', type: 'string' }],
});

export default transformation;
