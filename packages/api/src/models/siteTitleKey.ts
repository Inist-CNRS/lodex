// The stored theme variable holding the site name. Every theme declares
// `siteTitle`; ISTEX configurations saved before the rename still use `title`.
export const getSiteTitleKey = (storedVariables: Record<string, unknown>) =>
    'title' in storedVariables ? 'title' : 'siteTitle';
