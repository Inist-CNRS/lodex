import { rawTransformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation';

export const truncate = (value, arg) => {
    if (!value) {
        return value;
    }
    const gap = Number(arg);

    const normalizedValue = Array.isArray(value) ? value : value.toString();

    return normalizedValue.slice(0, gap);
};

const transformation = (_, args) => (value) =>
    rawTransformerWithArg(truncate, 'gap', value, args);

transformation.getMetas = () => ({
    name: 'TRUNCATE',
    type: 'transform',
    args: [{ name: 'gap', type: 'number' }],
    docUrl: documentationByOperation['TRUNCATE'],
});

export default transformation;
