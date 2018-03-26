import { transformerWithTwoArgs } from './transformer';

export const replace = (value, from, by) =>
    typeof value === 'string' ? value.split(from).join(by) : value;

const transformation = (_, args) => value =>
    transformerWithTwoArgs(replace, 'from', 'by', value, args);

transformation.getMetas = () => ({
    name: 'REPLACE',
    type: 'transform',
    args: [
        {
            name: 'from',
            type: 'string',
        },
        {
            name: 'by',
            type: 'string',
        },
    ],
});

export default transformation;
