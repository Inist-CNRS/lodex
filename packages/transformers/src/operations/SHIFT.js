import { rawTransformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation.json';

export const shift = (value, arg) => {
    if (!value) {
        return value;
    }
    const gap = Number(arg);
    return Array.isArray(value) || typeof value === 'string'
        ? value.slice(gap)
        : gap - value;
};

const transformation = (_, args) => (value) =>
    rawTransformerWithArg(shift, 'gap', value, args);

transformation.getMetas = () => ({
    name: 'SHIFT',
    type: 'transform',
    args: [{ name: 'gap', type: 'number' }],
    docUrl: documentationByOperation['SHIFT'],
});

export default transformation;
