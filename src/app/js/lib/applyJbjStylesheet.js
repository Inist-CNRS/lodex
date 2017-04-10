import fetch from './fetch';

export default token => (value, stylesheet) =>
    fetch({
        url: '/api/parsing/apply-jbj-stylesheet',
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value, stylesheet }),
    }).then(({ response, error }) => {
        if (error) {
            return '';
        }
        return response.result;
    });
