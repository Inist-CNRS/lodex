import { rawTransformerWithArg } from './transformer';

export const defval = (value, alternative) => {
    if (!value) {
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
