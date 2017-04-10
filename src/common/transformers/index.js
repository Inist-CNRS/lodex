import AUTOGENERATE_URI from './AUTOGENERATE_URI';
import COLUMN from './COLUMN';
import UPPERCASE from './UPPERCASE';
import LINK from './LINK';
import VALUE from './VALUE';
import CONCAT from './CONCAT';
import JBJ from './JBJ';
import JOIN from './JOIN';
import CONCAT_URI from './CONCAT_URI';
import SPLIT from './SPLIT';

const transformers = {
    AUTOGENERATE_URI,
    COLUMN,
    UPPERCASE,
    LINK,
    VALUE,
    CONCAT,
    JBJ,
    JOIN,
    CONCAT_URI,
    SPLIT,
};

export default transformers;

const transformersMetas = [
    AUTOGENERATE_URI,
    COLUMN,
    LINK,
    UPPERCASE,
    VALUE,
    CONCAT,
    JBJ,
    JOIN,
    CONCAT_URI,
    SPLIT,
].map(transformation => transformation.getMetas());

export const getTransformersMetas = type => (type ? transformersMetas.filter(m => m.type === type) : transformersMetas);

export const getTransformerMetas = (operation) => {
    const transformer = transformers[operation];

    if (!transformer) return [];

    return transformer.getMetas();
};
