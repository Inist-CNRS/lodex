// @ts-expect-error TS7006
export function getResourceType(resourceUri, field) {
    if (resourceUri?.startsWith('/graph') || field?.scope === 'graphic') {
        return 'graph';
    }

    if (resourceUri === '/' || !resourceUri) {
        return 'home';
    }

    return 'resource';
}
