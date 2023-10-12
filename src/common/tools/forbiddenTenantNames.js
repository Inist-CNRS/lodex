export const INVALID_NAMES = ['admin', 'root', 'default', ''];
export const checkForbiddenNames = value => INVALID_NAMES.includes(value);
export const forbiddenNamesMessage = INVALID_NAMES.filter(name => !!name)
    .map((name, index, list) =>
        index === list.length - 1 ? `or "${name}"` : `"${name}"`,
    )
    .join(', ');