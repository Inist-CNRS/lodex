import { transformerWithTwoArgs } from './transformer';

export const replace = (value, searchValue, replaceValue) => {
    const template = typeof searchValue === 'string' ? searchValue : searchValue.toString();
    const cleantemplate = template.trim().replace(/^[/]+/, '').replace(/[/]+$/, '');
    return value.replace(RegExp(cleantemplate, 'gi'), replaceValue);
};

const transformation = (_, args) => (value) => transformerWithTwoArgs(
    replace,
    'searchValue',
    'replaceValue',
    value,
    args,
);

transformation.getMetas = () => ({
    name: 'REPLACE_REGEX',
    type: 'transform',
    args: [
        {
            name: 'searchValue',
            type: 'string',
        },
        {
            name: 'replaceValue',
            type: 'string',
        },
    ],
});

export default transformation;
