// Promises
import COLUMN from './operations/COLUMN.js';
import UPPERCASE from './operations/UPPERCASE.js';
import LOWERCASE from './operations/LOWERCASE.js';
import VALUE from './operations/VALUE.js';
import ROUTINE from './operations/ROUTINE.js';
import CONCAT from './operations/CONCAT.js';
import JOIN from './operations/JOIN.js';
import CONCAT_URI from './operations/CONCAT_URI.js';
import SPLIT from './operations/SPLIT.js';
import PREFIX from './operations/PREFIX.js';
import SUFFIX from './operations/SUFFIX.js';
import DEFAULT from './operations/DEFAULT.js';
import STRING from './operations/STRING.js';
import REMOVE from './operations/REMOVE.js';
import REPLACE from './operations/REPLACE.js';
import REPLACE_REGEX from './operations/REPLACE_REGEX.js';
import NUMBER from './operations/NUMBER.js';
import BOOLEAN from './operations/BOOLEAN.js';
import TRUNCATE from './operations/TRUNCATE.js';
import TRUNCATE_WORDS from './operations/TRUNCATE_WORDS.js';
import SHIFT from './operations/SHIFT.js';
import TRIM from './operations/TRIM.js';
import CAPITALIZE from './operations/CAPITALIZE.js';
import MD5 from './operations/MD5.js';
import UNIQ from './operations/UNIQ.js';
import FORMAT from './operations/FORMAT.js';
import PARSE from './operations/PARSE.js';
import SELECT from './operations/SELECT.js';
import GET from './operations/GET.js';
import ARRAY from './operations/ARRAY.js';
import MASK from './operations/MASK.js';
import URLENCODE from './operations/URLENCODE.js';
import MAPPING from './operations/MAPPING.js';
import PRECOMPUTED from './operations/PRECOMPUTED.js';

// EZS statements
import $ARRAY from './dollar-array.js';
import $BOOLEAN from './dollar-boolean.js';
import $CAPITALIZE from './dollar-capitalize.js';
import $MD5 from './dollar-md5.js';
import $COLUMN from './dollar-column.js';
import $CONCAT from './dollar-concat.js';
import $CONCAT_URI from './dollar-concat-uri.js';
import $DEFAULT from './dollar-default.js';
import $FORMAT from './dollar-format.js';
import $GET from './dollar-get.js';
import $JOIN from './dollar-join.js';
import $LOWERCASE from './dollar-lowercase.js';
import $MASK from './dollar-mask.js';
import $NUMBER from './dollar-number.js';
import $PARSE from './dollar-parse.js';
import $PREFIX from './dollar-prefix.js';
import $REMOVE from './dollar-remove.js';
import $REPLACE from './dollar-replace.js';
import $REPLACE_REGEX from './dollar-replace-regex.js';
import $SELECT from './dollar-select.js';
import $SHIFT from './dollar-shift.js';
import $SPLIT from './dollar-split.js';
import $STRING from './dollar-string.js';
import $SUFFIX from './dollar-suffix.js';
import $TRIM from './dollar-trim.js';
import $TRUNCATE from './dollar-truncate.js';
import $TRUNCATE_WORDS from './dollar-truncate-words.js';
import $UNIQ from './dollar-uniq.js';
import $UPPERCASE from './dollar-uppercase.js';
import $URLENCODE from './dollar-urlencode.js';
import $MAPPING from './dollar-mapping.js';
import $VALUE from './dollar-value.js';
import $PRECOMPUTED from './dollar-precomputed.js';
import $ROUTINE from './dollar-routine.js';

export default {
    $ARRAY,
    $BOOLEAN,
    $CAPITALIZE,
    $MD5,
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
    $ROUTINE,
};

export const transformers = {
    COLUMN,
    UPPERCASE,
    LOWERCASE,
    VALUE,
    ROUTINE,
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
    MD5,
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
    ROUTINE,
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
    MD5,
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
    .map((transformation) => transformation.getMetas())
    .sort((x, y) => x.name.localeCompare(y.name));
