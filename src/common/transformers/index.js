import memoizeTransformer from './memoizeTransformer';
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
import PREFIX from './PREFIX';
import SUFFIX from './SUFFIX';
import DEFAULT from './DEFAULT';
import STRING from './STRING';
import NUMBER from './NUMBER';
import BOOLEAN from './BOOLEAN';
import TRUNCATE from './TRUNCATE';
import SHIFT from './SHIFT';

const transformers = {
    AUTOGENERATE_URI: memoizeTransformer(AUTOGENERATE_URI),
    COLUMN: memoizeTransformer(COLUMN),
    UPPERCASE: memoizeTransformer(UPPERCASE),
    LINK: memoizeTransformer(LINK),
    VALUE: memoizeTransformer(VALUE),
    CONCAT: memoizeTransformer(CONCAT),
    JBJ: memoizeTransformer(JBJ),
    JOIN: memoizeTransformer(JOIN),
    CONCAT_URI: memoizeTransformer(CONCAT_URI),
    SPLIT: memoizeTransformer(SPLIT),
    PREFIX: memoizeTransformer(PREFIX),
    SUFFIX: memoizeTransformer(SUFFIX),
    DEFAULT: memoizeTransformer(DEFAULT),
    STRING: memoizeTransformer(STRING),
    NUMBER: memoizeTransformer(NUMBER),
    BOOLEAN: memoizeTransformer(BOOLEAN),
    TRUNCATE: memoizeTransformer(TRUNCATE),
    SHIFT: memoizeTransformer(SHIFT),
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
    PREFIX,
    SUFFIX,
    DEFAULT,
    STRING,
    NUMBER,
    BOOLEAN,
    TRUNCATE,
    SHIFT,
]
    .map(transformation => transformation.getMetas())
    .sort((x, y) => x.name.localeCompare(y.name));

export const getTransformersMetas = type =>
    type ? transformersMetas.filter(m => m.type === type) : transformersMetas;

export const getTransformerMetas = operation => {
    const transformer = transformers[operation];

    if (!transformer) return [];

    return transformer.getMetas();
};
