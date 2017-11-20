export default (queryString = '') =>
    queryString
        .slice(1)
        .split('&')
        .map(v => v.split('='))
        .reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }), {});
