export const URI_FIELD_NAME = 'uri';

export const getResourceUri = (resource, defaultBaseUri) => {
    const baseUri = process.env.PUBLIC_URL || defaultBaseUri;
    return `${baseUri}/${resource.uri}`;
};
