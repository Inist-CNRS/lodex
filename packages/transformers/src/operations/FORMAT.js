import { vsprintf } from 'sprintf-js';
import { rawTransformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation';

export const format = (value, tpl) => {
    if (!value) {
        return tpl;
    }
    if (Array.isArray(value)) {
        return vsprintf(tpl, value);
    }
    return vsprintf(tpl, [value]);
};

const transformation = (_, args) => (value) =>
    rawTransformerWithArg(format, 'with', value, args);

transformation.getMetas = () => ({
    name: 'FORMAT',
    type: 'transform',
    args: [{ name: 'with', type: 'string' }],
    docUrl: documentationByOperation['FORMAT'],
});

export default transformation;
