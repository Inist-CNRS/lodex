import path from 'path';
import { hostname } from 'config';

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

    if (u.indexOf('http://') !== 0 &&
        u.indexOf('https://') !== 0) {
        return path.normalize(hostname.concat(u));
    }

    return u;
};

export default getUri;
