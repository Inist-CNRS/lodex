import _get from 'lodash/get.js';
import _flatten from 'lodash/flatten.js';
import { transformerWithArg } from './transformer.js';
import documentationByOperation from './documentationByOperation.js';

export const get = (value, path) => {
    const keys = path.split(';');
    const values = _flatten(keys.map((key) => _get(value, key, '')));
    return values.length === 1 ? values[0] : values;
};

const transformation = (_, args) => (value) =>
    transformerWithArg(get, 'path', value, args);

transformation.getMetas = () => ({
    name: 'GET',
    type: 'transform',
    args: [{ name: 'path', type: 'string' }],
    docUrl: documentationByOperation['GET'],
});

export default transformation;
