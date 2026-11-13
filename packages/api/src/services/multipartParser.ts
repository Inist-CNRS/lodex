import asyncBusboy from '@recuperateur/async-busboy';

/**
 * Bounds applied to every multipart request the API parses.
 *
 * busboy defaults `fields`, `files` and `parts` to Infinity, and
 * `@recuperateur/async-busboy` keeps every field it parses in a `fields` object
 * on the heap until the request ends. A request that declares an unbounded
 * number of fields therefore grows the API's heap without bound. Files are
 * streamed to temporary files by the parser, so their size is bounded by disk;
 * the counts are what is held in memory, so the counts are what this bounds.
 *
 * The values are deliberately generous: the resumable upload protocol sends
 * nine fields per chunk and one file, and the field import sends one file and
 * no fields. `fieldSize` keeps busboy's own 1 MiB default, so the worst case a
 * request can hold is bounded at roughly 100 MiB instead of growing without
 * bound.
 */
export const MULTIPART_LIMITS = {
    fields: 100,
    files: 10,
    parts: 111,
};

export const parseMultipart = (req: any, options: any = {}) =>
    asyncBusboy(req, {
        ...options,
        limits: { ...MULTIPART_LIMITS, ...(options.limits || {}) },
    });
