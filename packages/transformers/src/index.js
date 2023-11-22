// Promises
import COLUMN from './operations/COLUMN';
import UPPERCASE from './operations/UPPERCASE';
import LOWERCASE from './operations/LOWERCASE';
import VALUE from './operations/VALUE';
import CONCAT from './operations/CONCAT';
import JOIN from './operations/JOIN';
import CONCAT_URI from './operations/CONCAT_URI';
import SPLIT from './operations/SPLIT';
import PREFIX from './operations/PREFIX';
import SUFFIX from './operations/SUFFIX';
import DEFAULT from './operations/DEFAULT';
import STRING from './operations/STRING';
import REMOVE from './operations/REMOVE';
import REPLACE from './operations/REPLACE';
import REPLACE_REGEX from './operations/REPLACE_REGEX';
import NUMBER from './operations/NUMBER';
import BOOLEAN from './operations/BOOLEAN';
import TRUNCATE from './operations/TRUNCATE';
import TRUNCATE_WORDS from './operations/TRUNCATE_WORDS';
import SHIFT from './operations/SHIFT';
import TRIM from './operations/TRIM';
import CAPITALIZE from './operations/CAPITALIZE';
import UNIQ from './operations/UNIQ';
import FORMAT from './operations/FORMAT';
import PARSE from './operations/PARSE';
import SELECT from './operations/SELECT';
import GET from './operations/GET';
import ARRAY from './operations/ARRAY';
import MASK from './operations/MASK';
import URLENCODE from './operations/URLENCODE';
import MAPPING from './operations/MAPPING';
import PRECOMPUTED from './operations/PRECOMPUTED';

// EZS statements
import $ARRAY from './dollar-array';
import $BOOLEAN from './dollar-boolean';
import $CAPITALIZE from './dollar-capitalize';
import $COLUMN from './dollar-column';
import $CONCAT from './dollar-concat';
import $CONCAT_URI from './dollar-concat-uri';
import $DEFAULT from './dollar-default';
import $FORMAT from './dollar-format';
import $GET from './dollar-get';
import $JOIN from './dollar-join';
import $LOWERCASE from './dollar-lowercase';
import $MASK from './dollar-mask';
import $NUMBER from './dollar-number';
import $PARSE from './dollar-parse';
import $PREFIX from './dollar-prefix';
import $REMOVE from './dollar-remove';
import $REPLACE from './dollar-replace';
import $REPLACE_REGEX from './dollar-replace-regex';
import $SELECT from './dollar-select';
import $SHIFT from './dollar-shift';
import $SPLIT from './dollar-split';
import $STRING from './dollar-string';
import $SUFFIX from './dollar-suffix';
import $TRIM from './dollar-trim';
import $TRUNCATE from './dollar-truncate';
import $TRUNCATE_WORDS from './dollar-truncate-words';
import $UNIQ from './dollar-uniq';
import $UPPERCASE from './dollar-uppercase';
import $URLENCODE from './dollar-urlencode';
import $MAPPING from './dollar-mapping';
import $VALUE from './dollar-value';
import $PRECOMPUTED from './dollar-precomputed';

export default {
    $ARRAY,
    $BOOLEAN,
    $CAPITALIZE,
    $COLUMN,
    $CONCAT,
    $CONCAT_URI,
    $DEFAULT,
    $FORMAT,
    $GET,
    $JOIN,
    $LOWERCASE,
    $MASK,
    $NUMBER,
    $PARSE,
    $PREFIX,
    $REMOVE,
    $REPLACE,
    $REPLACE_REGEX,
    $SELECT,
    $SHIFT,
    $SPLIT,
    $STRING,
    $SUFFIX,
    $TRIM,
    $TRUNCATE,
    $UNIQ,
    $UPPERCASE,
    $URLENCODE,
    $VALUE,
    $MAPPING,
    $TRUNCATE_WORDS,
    $PRECOMPUTED,
};

export const transformers = {
    COLUMN,
    UPPERCASE,
    LOWERCASE,
    VALUE,
    CONCAT,
    JOIN,
    CONCAT_URI,
    SPLIT,
    PREFIX,
    SUFFIX,
    DEFAULT,
    REMOVE,
    REPLACE,
    REPLACE_REGEX,
    STRING,
    NUMBER,
    BOOLEAN,
    TRUNCATE,
    TRUNCATE_WORDS,
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
    MAPPING,
    PRECOMPUTED,
};

export const transformersMetas = [
    COLUMN,
    UPPERCASE,
    LOWERCASE,
    VALUE,
    CONCAT,
    JOIN,
    CONCAT_URI,
    SPLIT,
    PREFIX,
    SUFFIX,
    DEFAULT,
    STRING,
    REMOVE,
    REPLACE,
    REPLACE_REGEX,
    NUMBER,
    BOOLEAN,
    TRUNCATE,
    TRUNCATE_WORDS,
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
    MAPPING,
    PRECOMPUTED,
]
    .map(transformation => transformation.getMetas())
    .sort((x, y) => x.name.localeCompare(y.name));
