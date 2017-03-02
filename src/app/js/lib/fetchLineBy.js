import fetch from './fetch';

export default token => (fieldName, value) =>
    fetch({
        url: `/api/parsing/${fieldName}/${value}`,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }).then(({ response, error }) => {
        if (error) {
            return '';
        }
        return response;
    });
