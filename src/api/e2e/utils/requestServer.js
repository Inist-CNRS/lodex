import fetch from 'fetch-with-proxy';
import config from 'config';

import server from '../../';

export default () => {
    const app = server.listen(config.port);

    return {
        get: (url, headers = {}) =>
            fetch(`${config.host}${url}`, {
                method: 'GET',
                headers: {
                    ...headers,
                },
            }),
        post: (url, body, headers = {}) =>
            fetch(`${config.host}${url}`, {
                method: 'POST',
                headers: {
                    ...headers,
                },
                body: JSON.stringify(body),
            }),
        put: (url, body, headers = {}) =>
            fetch(`${config.host}${url}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(body),
            }),
        del: (url, body, headers = {}) =>
            fetch(`${config.host}${url}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(body),
            }),
        close: () => app.close(),
    };
};
