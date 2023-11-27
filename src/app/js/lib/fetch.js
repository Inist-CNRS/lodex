import fetch from 'fetch-with-proxy';

import { getHost } from '../../../common/uris';
import { DEFAULT_TENANT } from '../../../common/tools/tenantTools';

export default ({ url, ...config }, mode = 'json') => {
    const fullUrl = url.startsWith('http') ? url : getHost() + url;

    // if session storage is available, we add the tenant in the header
    if (typeof sessionStorage !== 'undefined') {
        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        // Set Tenant in header if not already set
        if (!config.headers) {
            config.headers = {};
        }

        if (!config.headers['X-Lodex-Tenant']) {
            config.headers['X-Lodex-Tenant'] = tenant;
        }
    }
    // when fetch is use to call external API, like api.istex.fr
    if (url.startsWith('http') && fullUrl.indexOf(getHost()) == -1) {
        delete config.headers['X-Lodex-Tenant'];
    }

    return fetch(fullUrl, config).then(
        response => {
            if (response.status === 204) {
                return { response: null };
            }
            if (response.status >= 200 && response.status < 300) {
                if (mode === 'blob') {
                    // TODO
                    // This header is missing in new api calls, so we don't use it anymore
                    // But maybe it can be fixed elsewere in a better way
                    const contentDisposition = response.headers.get(
                        'content-disposition',
                    );
                    let filename = 'export.csv';
                    if (contentDisposition) {
                        filename = contentDisposition
                            .match(
                                /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/,
                            )
                            .slice(1, 2);
                    } else {
                        const paths = new URL(fullUrl).pathname.split('/');
                        const exportType = paths[paths.length - 1];
                        const exportExtent = {
                            jsonallvalue: 'json',
                            jsonld: 'json',
                            nquads: 'n-quads',
                            'extended-nquads': 'n-quads',
                            'extended-nquads-compressed': 'gzip',
                            kbart: 'tsv',
                            raw: 'json',
                        };
                        filename = `export.${
                            exportExtent[exportType]
                                ? exportExtent[exportType]
                                : exportType
                        }`;
                    }

                    return response
                        .blob()
                        .then(blob => ({ response: blob, filename }));
                }

                return response
                    .json()
                    .then(json => ({ response: json }))
                    .catch(error => ({ error }));
            }

            return response.json().then(
                json => {
                    const error = new Error(json.error);
                    error.response = response;
                    error.code = response.status;
                    return { error };
                },
                () => {
                    const error = new Error(response.statusText);
                    error.response = response;
                    error.code = response.status;
                    return { error };
                },
            );
        },
        error => ({ error }),
    );
};
