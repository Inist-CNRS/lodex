import { rawTransformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation.json';

const isEmpty = (value) =>
    String(value).trim() === '' || value === null || value === undefined;

export const defval = (value, alternative) => {
    if (Array.isArray(value) && value.length === 0) {
        return [alternative];
    }
    if (Array.isArray(value)) {
        return value.map((x) => (isEmpty(x) ? alternative : x));
    }
    if (isEmpty(value)) {
        return alternative;
    }
    return value;
};

const transformation = (_, args) => (value) =>
    rawTransformerWithArg(defval, 'alternative', value, args);

transformation.getMetas = () => ({
    name: 'DEFAULT',
    type: 'transform',
    args: [{ name: 'alternative', type: 'string' }],
    docUrl: documentationByOperation['DEFAULT'],
});

export default transformation;
