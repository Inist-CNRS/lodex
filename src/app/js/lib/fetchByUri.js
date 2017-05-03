import fetch from './fetch';

export default (uri, token) =>
    fetch({
        url: `/api/publishedDataset/ark?uri=${uri}`,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }).then(({ response, error }) => {
        if (error) {
            throw error;
        }
        return response;
    });
