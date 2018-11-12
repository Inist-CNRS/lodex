import { transformerWithArg } from './transformer';

export const mask = (value, reg) => {
    if (typeof value === 'string') {
        return RegExp(reg, 'gi').test(value) ? value : null;
    }
    return null;
};

const transformation = (_, args) => value =>
    transformerWithArg(mask, 'with', value, args);

transformation.getMetas = () => ({
    name: 'MASK',
    type: 'transform',
    args: [{ name: 'with', type: 'string' }],
});

export default transformation;
