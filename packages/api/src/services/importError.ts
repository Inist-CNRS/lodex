// the translation keys of the import errors explained to the user
export type ImportErrorCode =
    | 'import_error_source_unavailable'
    | 'import_error_invalid_query'
    | 'import_error_source_not_found'
    | 'import_error_source_timeout'
    | 'import_error_invalid_format'
    | 'import_error_loader'
    | 'import_error_unknown';

export type ImportError = {
    code: ImportErrorCode;
    // the technical error, for the curious and the support
    detail: string;
    // the answer of the source, which often says what went wrong
    apiMessage?: string;
};

type ErrorLike = {
    message?: string;
    stack?: string;
    status?: number;
    responseText?: string;
    // a system error: ECONNREFUSED, ETIMEDOUT…
    code?: string;
    cause?: unknown;
    sourceError?: unknown;
    // set by ezs on the error of a statement: its name and the item number
    func?: string;
    index?: number;
};

// ponytail: a maintenance page can be a whole HTML page
const MAX_API_MESSAGE_LENGTH = 1000;

// ezs returns the whole stack trace: keep the message part only
const getEzsMessageError = (message: string) => {
    if (message.includes('Line')) {
        return message.substring(0, message.indexOf('Line'));
    }
    if (message.includes('<SyntaxError')) {
        return message.substring(0, message.indexOf('<SyntaxError'));
    }
    return message;
};

// the loader server answers a failed loader with the error of its statement
const parseSerializedError = (text: unknown): ErrorLike | null => {
    if (typeof text !== 'string') {
        return null;
    }
    try {
        const error = JSON.parse(text);
        // an ezs error, not the JSON answer of a source
        return error && typeof error.stack === 'string' ? error : null;
    } catch {
        return null;
    }
};

// goes down from the import error to the error of the source, the last one
const getErrorChain = (error: ErrorLike): ErrorLike[] => {
    // ezs keeps the error of a statement as sourceError
    const inner = error.cause ?? error.sourceError;
    if (inner && typeof inner === 'object') {
        return [error, ...getErrorChain(inner as ErrorLike)];
    }
    const serialized = parseSerializedError(error.responseText);
    return serialized ? [error, ...getErrorChain(serialized)] : [error];
};

// the expression of a loader that threw (an assign value), as V8 shows it:
// "Lodash:1\n<expression>\n    ^\n\nTypeError: …"
const getFailedExpression = (stack?: string) =>
    stack?.match(/^[^\n]+:\d+\n(.+)\n *\^/)?.[1].trim();

const getCode = ({
    status,
    message,
    code,
    stack,
}: ErrorLike): ImportErrorCode => {
    if (status === 400) {
        return 'import_error_invalid_query';
    }
    if (status === 401 || status === 403 || status === 404) {
        return 'import_error_source_not_found';
    }
    if (status && status >= 500) {
        return 'import_error_source_unavailable';
    }
    // the first line of the stack names the error (SyntaxError); the rest is
    // frames, where a timer reads like a timeout
    const text = `${message} ${code ?? ''} ${stack?.split('\n')[0] ?? ''}`;
    if (/timeout|ETIMEDOUT/i.test(text)) {
        return 'import_error_source_timeout';
    }
    if (/ECONNREFUSED|ENOTFOUND|EAI_AGAIN|ECONNRESET/.test(text)) {
        return 'import_error_source_unavailable';
    }
    if (/SyntaxError/.test(text)) {
        return 'import_error_invalid_format';
    }
    return 'import_error_unknown';
};

// ponytail: the entities of French pages only, add a library if others show up
const NAMED_ENTITIES: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    hellip: '…',
    rsquo: '’',
    laquo: '«',
    raquo: '»',
    agrave: 'à',
    acirc: 'â',
    ccedil: 'ç',
    eacute: 'é',
    egrave: 'è',
    ecirc: 'ê',
    euml: 'ë',
    icirc: 'î',
    iuml: 'ï',
    ocirc: 'ô',
    ugrave: 'ù',
    ucirc: 'û',
};

const decodeEntities = (text: string) =>
    text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
        if (code[0] !== '#') {
            return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
        }
        const codePoint =
            code[1].toLowerCase() === 'x'
                ? parseInt(code.slice(2), 16)
                : parseInt(code.slice(1), 10);
        // fromCodePoint throws out of the unicode range
        return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;
    });

// a maintenance or error page: its text only
const toText = (answer: string) =>
    /^\s*</.test(answer)
        ? decodeEntities(
              answer
                  // the head (title, styles) repeats or hides the message
                  .replace(/<(head|script|style)[\s\S]*?<\/\1>/gi, ' ')
                  .replace(/<[^>]*>/g, ' '),
          )
              .replace(/\s+/g, ' ')
              .trim()
        : answer;

const shorten = (text: string) =>
    text.length > MAX_API_MESSAGE_LENGTH
        ? `${text.slice(0, MAX_API_MESSAGE_LENGTH)}…`
        : text;

// the statement the error comes from: the deepest one
const getFailedStatement = (chain: ErrorLike[]) =>
    chain.findLast(
        ({ func, index }) =>
            typeof func === 'string' && typeof index === 'number',
    );

export const getImportError = (error: ErrorLike): ImportError => {
    const chain = getErrorChain(error);
    const sourceError = chain[chain.length - 1];
    const statement = getFailedStatement(chain);
    const apiMessage =
        sourceError.responseText && toText(sourceError.responseText).trim();
    const code = getCode(sourceError);
    return {
        // an unknown error of a statement of the loader: the loader does not
        // suit the data. Not of a network statement (URLConnect to the loader
        // server, URLFetch, URLStream…): the source or the server failed.
        code:
            code === 'import_error_unknown' &&
            statement &&
            !statement.func?.startsWith('URL')
                ? 'import_error_loader'
                : code,
        // the statement and the item explain more than the outer error
        detail: statement
            ? [
                  `item #${statement.index} [${statement.func}]: ${sourceError.message}`,
                  getFailedExpression(sourceError.stack),
              ]
                  .filter(Boolean)
                  .join('\n')
            : getEzsMessageError(String(error.message)),
        ...(apiMessage && { apiMessage: shorten(apiMessage) }),
    };
};
