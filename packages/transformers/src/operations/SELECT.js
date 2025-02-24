import get from 'lodash/get';
import documentationByOperation from './documentationByOperation';
import { rawTransformerWithArg } from './transformer';

export const select = (value, path) => {
    if (!value) {
        return '';
    }
    return get(value, path, '');
};

const transformation = (_, args) => (value) =>
    rawTransformerWithArg(select, 'path', value, args);

transformation.getMetas = () => ({
    name: 'SELECT',
    type: 'transform',
    args: [{ name: 'path', type: 'string' }],
    docUrl: documentationByOperation['SELECT'],
});

export default transformation;
