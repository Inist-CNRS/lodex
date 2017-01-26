import fetch from 'isomorphic-fetch';

export default ({ url, ...config }) =>
fetch(url, config)
.then((response) => {
    if (response.status >= 200 && response.status < 300) {
        return response.json()
        .then(json => ({ response: json }));
    }
    const error = new Error(response.statusText);
    error.response = response;
    error.code = response.status;
    return { error };
}, error => ({ error }));
