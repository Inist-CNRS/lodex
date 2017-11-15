import url from 'url';

export default (value) => {
    const target = url.parse(value);
    let uri = target.path.slice(1);
    if (!target.host) {
        target.host = window.location.host;
        target.protocol = window.location.protocol;
        target.pathname = value;
        target.query = {};
        uri = value;
    }
    return {
        url: target,
        uri,
    };
};
