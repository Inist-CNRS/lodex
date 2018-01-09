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
            }).then(response => response.text()),
        close: () => app.close(),
    };
};
