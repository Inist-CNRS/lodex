export function getResourceType(
    resourceUri: string | null | undefined,
    field?: { scope: string },
) {
    if (resourceUri?.startsWith('/graph') || field?.scope === 'graphic') {
        return 'graph';
    }

    if (resourceUri === '/' || !resourceUri) {
        return 'home';
    }

    return 'resource';
}
