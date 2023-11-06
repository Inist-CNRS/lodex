export const DEFAULT_TENANT = 'default';
export const ROOT_ROLE = 'root';
export const ADMIN_ROLE = 'admin';

export const INVALID_NAMES = [ADMIN_ROLE, ROOT_ROLE, DEFAULT_TENANT, ''];
export const checkForbiddenNames = value => INVALID_NAMES.includes(value);
export const forbiddenNamesMessage = INVALID_NAMES.filter(name => !!name)
    .map((name, index, list) =>
        index === list.length - 1 ? `or "${name}"` : `"${name}"`,
    )
    .join(', ');

export function extractTenantFromUrl(url) {
    const match = url.match(/\/instance\/([^/]+)/);
    return match ? match[1].toLowerCase() : DEFAULT_TENANT;
}
