import AUTOGENERATE_URI from './AUTOGENERATE_URI';
import COLUMN from './COLUMN';
import UPPERCASE from './UPPERCASE';
import LINK from './LINK';

const transformers = {
    AUTOGENERATE_URI,
    COLUMN,
    UPPERCASE,
    LINK,
};

export default transformers;

const transformersMetas = [
    AUTOGENERATE_URI,
    COLUMN,
    LINK,
    UPPERCASE,
].map(transformation => transformation.getMetas());

export const getTransformersMetas = () => transformersMetas;

export const getTransformerMetas = (operation) => {
    const transformer = transformers[operation];

    if (!transformer) return [];

    return transformer.getMetas().args;
};
