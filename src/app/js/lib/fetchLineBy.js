import fetch from './fetch';

export default (fieldName, value, token) =>
    fetch({
        url: `/api/parsing/${fieldName}/${value}`,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
