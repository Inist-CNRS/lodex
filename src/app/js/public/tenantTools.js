export function extractTenantFromUrl(url) {
    const match = url.match(/\/instance\/([^/]+)/);
    return match ? match[1] : 'default';
}
