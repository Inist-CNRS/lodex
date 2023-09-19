import { transformerWithArg } from './transformer';

export const prefix = (value, str) =>
    typeof value === 'string' ? str.concat(value) : value;

const transformation = (_, args) => value =>
    transformerWithArg(prefix, 'with', value, args);

transformation.getMetas = () => ({
    name: 'PREFIX',
    type: 'transform',
    args: [{ name: 'with', type: 'string' }],
});

export default transformation;
