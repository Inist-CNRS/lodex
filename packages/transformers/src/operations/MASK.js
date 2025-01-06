import { transformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation.json';

export const mask = (value, input) => {
    if (typeof value === 'string') {
        const template = typeof input === 'string' ? input : input.toString();
        const cleantemplate = template
            .trim()
            .replace(/^[/]+/, '')
            .replace(/[/]+$/, '');
        return RegExp(cleantemplate, 'gi').test(value) ? value : null;
    }
    return null;
};

const transformation = (_, args) => (value) =>
    transformerWithArg(mask, 'with', value, args);

transformation.getMetas = () => ({
    name: 'MASK',
    type: 'transform',
    args: [{ name: 'with', type: 'string' }],
    docUrl: documentationByOperation['MASK'],
});

export default transformation;
