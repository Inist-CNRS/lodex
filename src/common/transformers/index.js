import memoizeTransformer from './memoizeTransformer';
import AUTOGENERATE_URI from './AUTOGENERATE_URI';
import COLUMN from './COLUMN';
import UPPERCASE from './UPPERCASE';
import LOWERCASE from './LOWERCASE';
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
import REMOVE from './REMOVE';
import REPLACE from './REPLACE';
import NUMBER from './NUMBER';
import BOOLEAN from './BOOLEAN';
import TRUNCATE from './TRUNCATE';
import SHIFT from './SHIFT';
import TRIM from './TRIM';
import CAPITALIZE from './CAPITALIZE';
import UNIQ from './UNIQ';
import FORMAT from './FORMAT';
import PARSE from './PARSE';
import SELECT from './SELECT';
import GET from './GET';

const transformers = {
    AUTOGENERATE_URI: memoizeTransformer(AUTOGENERATE_URI),
    COLUMN: memoizeTransformer(COLUMN),
    UPPERCASE: memoizeTransformer(UPPERCASE),
    LOWERCASE: memoizeTransformer(LOWERCASE),
    VALUE: memoizeTransformer(VALUE),
    CONCAT: memoizeTransformer(CONCAT),
    JBJ: memoizeTransformer(JBJ),
    JOIN: memoizeTransformer(JOIN),
    CONCAT_URI: memoizeTransformer(CONCAT_URI),
    SPLIT: memoizeTransformer(SPLIT),
    PREFIX: memoizeTransformer(PREFIX),
    SUFFIX: memoizeTransformer(SUFFIX),
    DEFAULT: memoizeTransformer(DEFAULT),
    REMOVE: memoizeTransformer(REMOVE),
    REPLACE: memoizeTransformer(REPLACE),
    STRING: memoizeTransformer(STRING),
    NUMBER: memoizeTransformer(NUMBER),
    BOOLEAN: memoizeTransformer(BOOLEAN),
    TRUNCATE: memoizeTransformer(TRUNCATE),
    SHIFT: memoizeTransformer(SHIFT),
    TRIM: memoizeTransformer(TRIM),
    CAPITALIZE: memoizeTransformer(CAPITALIZE),
    UNIQ: memoizeTransformer(UNIQ),
    FORMAT: memoizeTransformer(FORMAT),
    PARSE: memoizeTransformer(PARSE),
    SELECT: memoizeTransformer(SELECT),
    GET: memoizeTransformer(GET),
    LINK: () => () => {
        console.warn(
            'DeprecationWarning: The LINK transformer is no longer supported',
        );
        return '';
    },
};

export default transformers;

const transformersMetas = [
    AUTOGENERATE_URI,
    COLUMN,
    UPPERCASE,
    LOWERCASE,
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
    REMOVE,
    REPLACE,
    NUMBER,
    BOOLEAN,
    TRUNCATE,
    SHIFT,
    TRIM,
    CAPITALIZE,
    UNIQ,
    FORMAT,
    PARSE,
    SELECT,
    GET,
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
