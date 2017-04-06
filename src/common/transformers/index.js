import AUTOGENERATE_URI from './AUTOGENERATE_URI';
import COLUMN from './COLUMN';
import UPPERCASE from './UPPERCASE';
import LINK from './LINK';
import VALUE from './VALUE';
import CONCAT from './CONCAT';
import JOIN from './JOIN';

const transformers = {
    AUTOGENERATE_URI,
    COLUMN,
    UPPERCASE,
    LINK,
    VALUE,
    CONCAT,
    JOIN,
};

export default transformers;

const transformersMetas = [
    AUTOGENERATE_URI,
    COLUMN,
    LINK,
    UPPERCASE,
    VALUE,
    CONCAT,
    JOIN,
].map(transformation => transformation.getMetas());

export const getTransformersMetas = type => (type ? transformersMetas.filter(m => m.type === type) : transformersMetas);

export const getTransformerMetas = (operation) => {
    const transformer = transformers[operation];

    if (!transformer) return [];

    return transformer.getMetas();
};
