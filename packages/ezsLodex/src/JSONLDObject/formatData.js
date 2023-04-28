import validUrl from 'valid-url';
// import { getCleanHost } from '../../../common/uris'; // IN LODEX

const formatWeb = (data, uri) => {
    if (validUrl.isWebUri(data)) {
        return { '@id': data };
    }
    if (validUrl.isUri(data)) {
        return { '@id': `${uri}/${data}` };
    }
    return data;
};

const formatData = (data, propertyName, getCleanHost = uri => uri) => {
    if (!Array.isArray(data[propertyName])) {
        return formatWeb(data[propertyName], getCleanHost(data.uri));
    }

    return data[propertyName].map(e => formatWeb(e, getCleanHost(data.uri)));
};

export default formatData;
