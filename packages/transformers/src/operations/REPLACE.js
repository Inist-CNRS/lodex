import { transformerWithTwoArgs } from './transformer';

export const replace = (value, searchValue, replaceValue) =>
    typeof value === 'string'
        ? value.split(searchValue).join(replaceValue)
        : value;

const transformation = (_, args) => value =>
    transformerWithTwoArgs(replace, 'searchValue', 'replaceValue', value, args);

transformation.getMetas = () => ({
    name: 'REPLACE',
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
