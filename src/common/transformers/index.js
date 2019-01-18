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
import ARRAY from './ARRAY';
import MASK from './MASK';
import URLENCODE from './URLENCODE';

const transformers = {
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
    REMOVE,
    REPLACE,
    STRING,
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
    ARRAY,
    MASK,
    URLENCODE,
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
    ARRAY,
    MASK,
    URLENCODE,
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
