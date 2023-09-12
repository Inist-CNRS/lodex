import { rawTransformerWithoutArg } from './transformer';

export const parse = value => {
    if (typeof value !== 'string') {
        return value;
    }
    try {
        return JSON.parse(value);
    } catch (e) {
        console.error(e);
        return value;
    }
};

const transformation = (_, args) => value =>
    rawTransformerWithoutArg(parse, value, args);

transformation.getMetas = () => ({
    name: 'PARSE',
    type: 'transform',
    args: [],
});

export default transformation;
