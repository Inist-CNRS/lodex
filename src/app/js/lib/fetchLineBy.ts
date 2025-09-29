import fetch from './fetch';

// @ts-expect-error TS7006
export default (token) => (fieldName, value) =>
    fetch({
        url: `/api/parsing/${fieldName}/${value}`,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        // @ts-expect-error TS7031
    }).then(({ response, error }) => {
        if (error) {
            return '';
        }
        return response;
    });
