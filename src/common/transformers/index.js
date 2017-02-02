import AUTOGENERATE_URI from './AUTOGENERATE_URI';
import COLUMN from './COLUMN';
import UPPERCASE from './UPPERCASE';

const transformers = {
    AUTOGENERATE_URI,
    COLUMN,
    UPPERCASE,
};

export default transformers;

export const getTransformersMetas = () => [
    AUTOGENERATE_URI,
    COLUMN,
    UPPERCASE,
].map(transformation => transformation.getMetas());

export const getTransformerMetas = (operation) => {
    const transformer = transformers[operation];

    if (!transformer) return [];

    return transformer.getMetas().args;
};
