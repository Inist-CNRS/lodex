export const URI_FIELD_NAME = 'uri';

export const isURL = v =>
    (typeof v === 'string' &&
        (v.startsWith('http://') || v.startsWith('https://'))) ||
    false;

export const isLocalURL = v =>
    (typeof v === 'string' &&
        (v.startsWith('/api/') ||
            v.startsWith('uid:') ||
            v.startsWith('ark:'))) ||
    false;

export const canonicalURL = u => {
    if (isURL(u)) {
        return u;
    } else if (isLocalURL(u)) {
        const h = getHost();
        return `${h}${u}`;
    }
    return '';
};

export const getResourceUri = resource => {
    const uri = resource.uri;
    if (!uri) {
        return null;
    }
    if (uri.startsWith('uid:/')) {
        return `/uid:/${encodeURIComponent(uri.substr(5))}`;
    }
    if (uri.startsWith('ark:/')) {
        return `/${uri}`;
    }
    if (uri.startsWith('http://' || uri.startsWith('https://'))) {
        return `/resource?uri=${encodeURIComponent(uri)}`;
    }

    return `/uid:/${encodeURIComponent(uri)}`;
};

export const getCleanHost = () => {
    const host = getHost();
    const reg = new RegExp('(\\-\\d+)(\\.[a-z0-9]+)+');
    const match = reg.exec(host);
    if (match) {
        return host.replace(match[1], '');
    }
    return host;
};

export const getHost = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.host}`;
    }
    if (BASE_API_URL) {
        return BASE_API_URL;
    }
    const host = process.env.EZMASTER_PUBLIC_URL || `http://localhost:3000`;
    return host;
};

export const getFullResourceUri = (resource, defaultBaseUri) => {
    const baseUri = getHost() || defaultBaseUri;
    const uri = getResourceUri(resource);

    return `${baseUri}${uri}`;
};
