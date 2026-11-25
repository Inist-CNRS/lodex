// the formats whose loader is not named after their extension
const LOADER_OF_EXTENSION: Record<string, string> = {
    jsonl: 'json-lines',
    ndjson: 'json-lines',
    'tar.gz': 'tar-gz',
    tgz: 'tar-gz',
};

// the extension of a file name or of a URL path (its query string left out),
// `tar.gz` kept whole; empty without one
export const getExtension = (source = '') => {
    let path = source;
    try {
        path = new URL(source).pathname;
    } catch {
        // a file name, not a URL
    }
    const [, extension = ''] =
        /\.(tar\.gz|[^./]+)$/i.exec(path.toLowerCase()) ?? [];
    return extension;
};

// the loader the automatic choice uses for a file extension
export const getLoaderForExtension = (extension = '') => {
    const lowerCase = extension.toLowerCase();
    return LOADER_OF_EXTENSION[lowerCase] ?? lowerCase;
};
