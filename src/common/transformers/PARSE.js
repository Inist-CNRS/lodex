import { rawTransformerWithoutArg } from './transformer';

export const parse = value => {
    try {
        return JSON.parse(value);
    } catch (e) {
        return e.toString();
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
