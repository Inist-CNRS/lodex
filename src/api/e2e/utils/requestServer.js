import fetch from 'fetch-with-proxy';
import config from 'config';
import { getHost } from '../../../common/uris';

import app from '../../app';
import { closeAllWorkerQueues } from '../../workers';

export default () => {
    const server = app.listen(config.port);

    return {
        get: (url, headers = {}) =>
            fetch(`${getHost()}${url}`, {
                method: 'GET',
                headers: {
                    ...headers,
                },
            }),
        post: (url, body, headers = {}) =>
            fetch(`${getHost()}${url}`, {
                method: 'POST',
                headers: {
                    ...headers,
                },
                body: JSON.stringify(body),
            }),
        put: (url, body, headers = {}) =>
            fetch(`${getHost()}${url}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(body),
            }),
        del: (url, body, headers = {}) =>
            fetch(`${getHost()}${url}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(body),
            }),
        close: () => {
            closeAllWorkerQueues();
            server.close();
        },
    };
};
