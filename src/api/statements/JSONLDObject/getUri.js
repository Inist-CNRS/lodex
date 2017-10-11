import path from 'path';
import { hostname } from 'config';
import url from 'url';

const removeNumberInstance = (uri) => {
    const reg = new RegExp('(\\-\\d+)(\\.[a-z]+)+');
    const match = reg.exec(uri);

    if (match !== null) {
        return uri.replace(match[1], '');
    }

    return uri;
};

const getUri = (uri) => {
    const u = removeNumberInstance(uri);

    if (!u.startsWith('http://') &&
        !u.startsWith('https://')) {
        const host = url.parse(hostname);
        const newPath = path.normalize(host.pathname.concat(u));
        return `${host.protocol}//${host.hostname}${newPath}`;
    }

    return u;
};

export default getUri;
