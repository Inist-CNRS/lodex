export const DEFAULT_TENANT = 'default';
export const ROOT_ROLE = 'root';
export const ADMIN_ROLE = 'admin';
export const USER_ROLE = 'user';
export const CONTRIBUTOR_ROLE = 'contributor';
export const MAX_DB_NAME_SIZE = 63;

export const INVALID_NAMES = [ADMIN_ROLE, ROOT_ROLE, DEFAULT_TENANT];

export const getTenantMaxSize = (dbName: string) =>
    MAX_DB_NAME_SIZE - (dbName.length ?? 0) - 1;

export const checkForbiddenNames = (value: any) =>
    INVALID_NAMES.includes(value);

export const forbiddenNamesMessage = INVALID_NAMES.filter((name) => !!name)
    .map((name, index, list) =>
        index === list.length - 1 ? `ou "${name}"` : `"${name}"`,
    )
    .join(', ');

export function extractTenantFromUrl(url: any) {
    const match = url.match(/\/instance\/([^/]+)/);
    return match ? match[1].toLowerCase() : DEFAULT_TENANT;
}
