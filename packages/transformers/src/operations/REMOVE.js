import { rawTransformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation';

export const remove = (value, the) => {
    if (typeof value === 'string') {
        return value.split(the).join('');
    }
    if (Array.isArray(value)) {
        return value.filter((x) => x !== the);
    }
    return value;
};

const transformation = (_, args) => (value) =>
    rawTransformerWithArg(remove, 'the', value, args);

transformation.getMetas = () => ({
    name: 'REMOVE',
    type: 'transform',
    args: [{ name: 'the', type: 'string' }],
    docUrl: documentationByOperation['REMOVE'],
});

export default transformation;
