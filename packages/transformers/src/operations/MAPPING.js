import JSON6 from 'json-6';
import { transformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation';

export const mapping = (value, input) => {
    const template = typeof input === 'string' ? input : input.toString();
    const cleantemplate = template
        .trim()
        .replace(/^[{[]+/, '')
        .replace(/[}\]]+$/, '');
    const list = JSON6.parse(`{${cleantemplate}}`);
    const cleanedValue = String(value).trim();
    const newValue = Object.keys(list)
        .map((searchValue) =>
            cleanedValue === searchValue ? list[searchValue] : null,
        )
        .filter(Boolean)
        .shift();
    return newValue || value;
};

const transformation = (_, args) => (value) =>
    transformerWithArg(mapping, 'list', value, args);

transformation.getMetas = () => ({
    name: 'MAPPING',
    type: 'transform',
    args: [{ name: 'list', type: 'string' }],
    docUrl: documentationByOperation['MAPPING'],
});

export default transformation;
