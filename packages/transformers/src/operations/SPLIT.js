import { rawTransformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation';

export const split = (value, separator) => {
    if (!value) {
        return [];
    }

    if (typeof value !== 'string') {
        throw new Error('Invalid value: need a string');
    }
    const splitted = value.split(separator).map((x) => x.trim());
    return splitted.filter((x) => x != '');
};

const transformation = (_, args) => (value) =>
    rawTransformerWithArg(split, 'separator', value, args);

transformation.getMetas = () => ({
    name: 'SPLIT',
    type: 'transform',
    args: [{ name: 'separator', type: 'string' }],
    docUrl: documentationByOperation['SPLIT'],
});

export default transformation;
