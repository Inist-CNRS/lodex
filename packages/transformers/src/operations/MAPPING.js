import JSON6 from 'json-6';
import { transformerWithArg } from './transformer';

export const mapping = (value, input) => {
    const template = typeof input === 'string' ? input : input.toString();
    const cleantemplate = template.trim().replace(/^[{[]+/, '').replace(/[}\]]+$/, '');
    const list = JSON6.parse(`{${cleantemplate}}`);
    return Object
        .keys(list)
        .reduce((currentValue, searchValue) => currentValue
            .split(searchValue)
            .join(list[searchValue]), value);
};

const transformation = (_, args) => (value) => (transformerWithArg(mapping, 'list', value, args));

transformation.getMetas = () => ({
    name: 'MAPPING',
    type: 'transform',
    args: [{ name: 'list', type: 'string' }],
});

export default transformation;
