import fetch from 'isomorphic-fetch';

export default ({ url, ...config }) =>
fetch(url, config)
.then((response) => {
    if (response.status >= 200 && response.status < 300) {
        return response
            .json()
            .then(json => ({ response: json }));
    }

    return response
        .json()
        .then((json) => {
            const error = new Error(json.error);
            error.response = response;
            error.code = response.status;
            return { error };
        }, () => {
            const error = new Error(response.statusText);
            error.response = response;
            error.code = response.status;
            return { error };
        });
}, error => ({ error }));
