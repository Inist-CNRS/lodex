import config from '../../config.json';

export const URI_FIELD_NAME = 'uri';

export const getResourceUri = (resource, defaultBaseUri) => {
    const baseUri = config.baseUri || process.env.EZMASTER_PUBLIC_URL || defaultBaseUri;
    return `${baseUri}/${resource.uri}`;
};
