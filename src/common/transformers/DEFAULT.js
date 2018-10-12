import { rawTransformerWithArg } from './transformer';

export const defval = (value, alternative) => {
    if (Array.isArray(value) && value.length === 0) {
        return [alternative];
    } else if (value === '' || value === null || value === undefined) {
        return alternative;
    }
    return value;
};

const transformation = (_, args) => value =>
    rawTransformerWithArg(defval, 'alternative', value, args);

transformation.getMetas = () => ({
    name: 'DEFAULT',
    type: 'transform',
    args: [{ name: 'alternative', type: 'string' }],
});

export default transformation;
