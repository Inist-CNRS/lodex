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
const serialized = (properties: Record<string, unknown>) => {
    const sourceError: Record<string, unknown> = {
        stack: `Error: ${properties.message}`,
        ...properties,
    };
    return JSON.stringify(
        wrapped('delegate', wrapped('URLFetch', sourceError)),
    );
};

// the error of URLConnect when the loader server fails (400)
const loaderServerError = (sourceError: Record<string, unknown>) =>
    new Error('Error during import: Error: Bad Request', {
        cause: wrapped(
            'URLConnect',
            Object.assign(new Error('Bad Request'), {
                status: 400,
                responseText: serialized(sourceError),
            }),
        ),
    });

describe('getImportError', () => {
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
            apiMessage: '{"message":"no such dataset"}',
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
});
