import { transformerWithTwoArgs } from './transformer';
import documentationByOperation from './documentationByOperation.json';

export const replace = (value, searchValue, replaceValue) =>
    typeof value === 'string'
        ? value.split(searchValue).join(replaceValue)
        : value;

const transformation = (_, args) => (value) =>
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
    docUrl: documentationByOperation['REPLACE'],
});

export default transformation;
