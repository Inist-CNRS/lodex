export const URI_FIELD_NAME = 'uri';

export const getResourceUri = (resource) => {
    const uri = resource.uri;
    if (!uri) {
        return null;
    }
    if (uri.startsWith('uid:/') || uri.startsWith('ark:/')) {
        return `/${uri}`;
    }
    if (uri.startsWith('http://' || uri.startsWith('https://'))) {
        return `/resource?uri=${encodeURIComponent(uri)}`;
    }

    return `/uid:/${encodeURIComponent(uri)}`;
};

export const getFullResourceUri = (resource, defaultBaseUri) => {
    const baseUri = process.env.PUBLIC_URL || defaultBaseUri;
    const uri = getResourceUri(resource);

    return `${baseUri}${uri}`;
};
