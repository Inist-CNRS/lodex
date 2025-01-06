import { transformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation';

export const suffix = (value, str) =>
    typeof value === 'string' ? value.concat(str) : value;

const transformation = (_, args) => (value) =>
    transformerWithArg(suffix, 'with', value, args);

transformation.getMetas = () => ({
    name: 'SUFFIX',
    type: 'transform',
    args: [{ name: 'with', type: 'string' }],
    docUrl: documentationByOperation['SUFFIX'],
});

export default transformation;
