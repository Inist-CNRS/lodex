import validUrl from 'valid-url';

const formatWeb = (data, uri) => {
    if (validUrl.isWebUri(data)) {
        return { '@id': data };
    } else if (validUrl.isUri(data)) {
        return { '@id': `${uri}/${data}` };
    }
    return data;
};

const formatData = (data, propertyName) => {
    if (!Array.isArray(data[propertyName])) {
        return formatWeb(data[propertyName]);
    }

    return data[propertyName].map(e => formatWeb(e, data.uri));
};

export default formatData;
