import _get from 'lodash.get';
import { transformerWithArg } from './transformer';

export const get = (value, path) => {
    return _get(value, path, '');
};

const transformation = (_, args) => value =>
    transformerWithArg(get, 'path', value, args);

transformation.getMetas = () => ({
    name: 'GET',
    type: 'transform',
    args: [{ name: 'path', type: 'string' }],
});

export default transformation;
