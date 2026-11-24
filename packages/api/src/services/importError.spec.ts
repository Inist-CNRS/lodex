import { getImportError } from './importError';

// ezs wraps the error of a statement, and keeps it as sourceError
const wrapped = <T extends { message?: unknown }>(
    statement: string,
    sourceError: T,
) => ({
    message: `item #1 [${statement}] <Error: ${sourceError.message}>`,
    stack: `Error: item #1 [${statement}] <Error: ${sourceError.message}>`,
    sourceError,
});

// the error of a loader statement, as the loader server serializes it
const serialized = (
    properties: Record<string, unknown>,
    statement = 'URLFetch',
) => {
    const sourceError: Record<string, unknown> = {
        stack: `Error: ${properties.message}`,
        ...properties,
    };
    return JSON.stringify(wrapped('delegate', wrapped(statement, sourceError)));
};

// the error of URLConnect when the loader server fails (400)
const loaderServerError = (
    sourceError: Record<string, unknown>,
    statement?: string,
) =>
    new Error('Error during import: Error: Bad Request', {
        cause: wrapped(
            'URLConnect',
            Object.assign(new Error('Bad Request'), {
                status: 400,
                responseText: serialized(sourceError, statement),
            }),
        ),
    });

describe('getImportError', () => {
    it('should report an import that read no line', () => {
        expect(
            getImportError(
                new Error(
                    'Error during import: Error: The loader read no line',
                    {
                        cause: Object.assign(
                            new Error('The loader read no line'),
                            {
                                code: 'import_error_no_line',
                            },
                        ),
                    },
                ),
            ).code,
        ).toBe('import_error_no_line');
    });

    it('should report an unavailable source with its message, under the loader server error', () => {
        expect(
            getImportError(
                loaderServerError({
                    message: 'Service Unavailable',
                    status: 503,
                    responseText: 'Maintenance en cours',
                }),
            ),
        ).toEqual({
            code: 'import_error_source_unavailable',
            detail: 'Error during import: Error: Bad Request',
            apiMessage: 'Maintenance en cours',
        });
    });

    const openAlexAnswer = {
        error: 'Invalid query parameters error.',
        message: 'annee_de_publication is not a valid field.',
    };
    // ezs.serializeError keeps only the keys that are error property names
    const serializedBody = { message: openAlexAnswer.message };
    it.each([
        // @ezs/conditor up to 2.14.4: the answer as body only
        [
            'OAFetch',
            { message: 'Bad Request', body: serializedBody },
            'annee_de_publication is not a valid field.',
        ],
        [
            'CORHALFetch',
            { message: 'Bad Request', body: serializedBody },
            'annee_de_publication is not a valid field.',
        ],
        // later versions: the status and the whole answer, like @ezs/basics
        [
            'OAFetch',
            {
                message: 'Bad Request',
                status: 400,
                responseText: JSON.stringify(openAlexAnswer),
                body: serializedBody,
            },
            'Invalid query parameters error.\nannee_de_publication is not a valid field.',
        ],
    ])(
        'should report the answer of the source of %s for %j',
        (statement, sourceError, apiMessage) => {
            expect(
                getImportError(loaderServerError(sourceError, statement)),
            ).toEqual({
                code: 'import_error_invalid_query',
                detail: 'Error during import: Error: Bad Request',
                apiMessage,
            });
        },
    );

    it.each([
        [
            '{"timestamp":"2026-11-24T10:00","status":"400","error":"Bad Request","path":"/works","message":"bad filter"}',
            'Bad Request\nbad filter',
        ],
        // no known key: the whole answer, nested details included
        [
            '{"status":"error","errors":[{"message":"field x is invalid"}]}',
            '{"status":"error","errors":[{"message":"field x is invalid"}]}',
        ],
    ])('should report the JSON answer %s as %j', (responseText, apiMessage) => {
        expect(
            getImportError(
                loaderServerError({
                    message: 'Bad Request',
                    status: 400,
                    responseText,
                }),
            ).apiMessage,
        ).toBe(apiMessage);
    });

    it('should not take the loader server error for an invalid query', () => {
        expect(
            getImportError(
                new Error('Error during import: Error: Bad Request', {
                    cause: new Error('Bad Request'),
                }),
            ).code,
        ).toBe('import_error_unknown');
    });

    it.each([
        [400, 'import_error_invalid_query'],
        [401, 'import_error_source_not_found'],
        [403, 'import_error_source_not_found'],
        [404, 'import_error_source_not_found'],
        [500, 'import_error_source_unavailable'],
        [502, 'import_error_source_unavailable'],
    ])('should classify a source answering %s', (status, code) => {
        expect(
            getImportError(loaderServerError({ message: 'whatever', status }))
                .code,
        ).toBe(code);
    });

    it.each([
        [
            'import_error_source_timeout',
            { message: 'The operation was aborted due to timeout' },
        ],
        [
            'import_error_source_timeout',
            { message: 'connect ETIMEDOUT 1.2.3.4:443' },
        ],
        [
            'import_error_source_unavailable',
            {
                message:
                    'fetch failed : connect ECONNREFUSED 127.0.0.1:80 ECONNREFUSED',
            },
        ],
        [
            'import_error_source_unavailable',
            { message: 'fetch failed : getaddrinfo ENOTFOUND theses.fr' },
        ],
        [
            'import_error_invalid_format',
            {
                message: 'Unexpected token < in JSON at position 0',
                stack: 'SyntaxError: Unexpected token < in JSON at position 0',
            },
        ],
    ])('should report %s for %j', (code, sourceError) => {
        expect(getImportError(loaderServerError(sourceError)).code).toBe(code);
    });

    it('should classify an error of Lodex fetching the url itself', () => {
        expect(
            getImportError(
                new Error('Error during import: Error: Not Found', {
                    cause: Object.assign(new Error('Not Found'), {
                        status: 404,
                        responseText: '{"message":"no such dataset"}',
                    }),
                }),
            ),
        ).toMatchObject({
            code: 'import_error_source_not_found',
            apiMessage: 'no such dataset',
        });
    });

    it('should keep only the message of an ezs trace in the detail', () => {
        expect(
            getImportError(new Error('Something broke Line 12 in file x.ini'))
                .detail,
        ).toBe('Something broke ');
    });

    it('should shorten a long message of the source', () => {
        const { apiMessage } = getImportError(
            loaderServerError({
                message: 'Service Unavailable',
                status: 503,
                responseText: 'x'.repeat(5000),
            }),
        );
        expect(apiMessage).toHaveLength(1001);
        expect(apiMessage?.endsWith('…')).toBe(true);
    });

    it('should keep only the text of an HTML page of the source', () => {
        const { apiMessage } = getImportError(
            loaderServerError({
                message: 'Service Unavailable',
                status: 503,
                responseText: `<!DOCTYPE html>
<html><head><title>Maintenance</title>
<style>body { color: red; }</style>
<script>window.track();</script></head>
<body><h1>Th&egrave;ses.fr est en maintenance</h1>
<p>Retour pr&#233;vu &agrave; 14h&nbsp;&amp; quelques&#x2026;</p></body></html>`,
            }),
        );
        expect(apiMessage).toBe(
            'Thèses.fr est en maintenance Retour prévu à 14h & quelques…',
        );
    });
    it('should keep an HTML entity out of the unicode range as is', () => {
        const { apiMessage } = getImportError(
            loaderServerError({
                message: 'Service Unavailable',
                status: 503,
                responseText: '<p>Broken &#x110000; &#99999999999; page</p>',
            }),
        );
        expect(apiMessage).toBe('Broken &#x110000; &#99999999999; page');
    });

    it('should report the statement of the loader that failed on a record', () => {
        // ezs names the statement and the item of the error it wraps
        const statementError = <T extends { message?: unknown }>(
            func: string,
            index: number,
            sourceError: T,
        ) => ({
            message: `item #${index} [${func}] <${sourceError.message}>`,
            stack: `Error: item #${index} [${func}]`,
            func,
            index,
            sourceError,
        });
        const expression =
            '_.chain(self).fix([self.level0_domain_s]).flatMap(item => item.split(",")).value();';
        const loaderAnswer = JSON.stringify(
            statementError('delegate', 1, {
                ...statementError('assign', 190, {
                    message:
                        "Cannot read properties of undefined (reading 'split')",
                    stack: `Lodash:1\n${expression}\n                                     ^\n\nTypeError: Cannot read properties of undefined (reading 'split')\n    at Lodash:1:143`,
                }),
            }),
        );
        const error = new Error('Error during import: Error: Bad Request', {
            cause: statementError(
                'URLConnect',
                1,
                Object.assign(new Error('Bad Request'), {
                    status: 400,
                    responseText: loaderAnswer,
                }),
            ),
        });

        expect(getImportError(error)).toEqual({
            code: 'import_error_loader',
            detail: `item #190 [assign]: Cannot read properties of undefined (reading 'split')\n${expression}`,
        });
    });

    // the source closed the connection: a retry may work, another loader not
    it('should not blame the loader for a network error of its fetch', () => {
        const error = new Error('Error during import: Error: Bad Request', {
            cause: {
                message: 'item #1 [URLFetch] <other side closed>',
                func: 'URLFetch',
                index: 1,
                sourceError: {
                    message: 'other side closed',
                    code: 'UND_ERR_SOCKET',
                },
            },
        });

        expect(getImportError(error)).toEqual({
            code: 'import_error_unknown',
            detail: 'item #1 [URLFetch]: other side closed',
        });
    });

    // URLParse only parses: it fails on data the loader does not suit
    it('should blame the loader for a statement that only parses a URL', () => {
        const error = new Error('Error during import', {
            cause: {
                message: 'item #3 [URLParse] <Invalid URL>',
                func: 'URLParse',
                index: 3,
                sourceError: { message: 'Invalid URL' },
            },
        });

        expect(getImportError(error).code).toBe('import_error_loader');
    });

    it('should not take an error thrown from a timer for a timeout', () => {
        expect(
            getImportError(
                loaderServerError({
                    message: 'Cannot read properties of undefined',
                    stack: `TypeError: Cannot read properties of undefined
    at Timeout._onTimeout (/app/loader.js:12:3)
    at listOnTimeout (node:internal/timers:581:17)`,
                }),
            ).code,
        ).toBe('import_error_unknown');
    });
});
